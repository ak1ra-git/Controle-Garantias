using Garantias.DTOs;
using Garantias.Interfaces;
using Garantias.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Garantias.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IConfiguration _configuration;

        public AuthService(IUsuarioRepository usuarioRepository, IConfiguration configuration)
        {
            _usuarioRepository = usuarioRepository;
            _configuration = configuration;
        }

        public async Task<bool> RegistrarAsync(RegistroDto dto)
        {
            var existente = await _usuarioRepository.ObterPorNomeAsync(dto.Nome);
            if (existente != null)
                return false; // usuario ja existe

            var usuario = new Usuario
            {
                Nome = dto.Nome,
                // BCrypt.HashPassword nunca guarda a senha em texto puro. Ele:
                //   1. gera um "salt" aleatorio (um valor unico pra essa senha)
                //   2. mistura o salt com a senha e roda o algoritmo bcrypt varias
                //      vezes em cima disso (isso e proposital: e devagar de proposito,
                //      pra dificultar ataques de forca bruta)
                //   3. devolve tudo junto num texto so: salt + hash
                // Por isso a mesma senha "123456" gera um hash diferente toda vez que
                // alguem se cadastra, e ninguem (nem a gente) consegue "descriptografar"
                // o hash de volta pra senha original — hash e uma via de mao unica.
                SenhaHash = BCrypt.Net.BCrypt.HashPassword(dto.Senha),
                DataCriacao = DateTime.Now
            };

            await _usuarioRepository.CriarAsync(usuario);
            return true;
        }

        public async Task<string?> LoginAsync(LoginDto dto)
        {
            var usuario = await _usuarioRepository.ObterPorNomeAsync(dto.Nome);
            if (usuario == null)
                return null;

            // Verify NAO descriptografa o hash salvo — ele pega a senha que a pessoa
            // acabou de digitar, extrai o salt que ja esta guardado dentro do
            // usuario.SenhaHash, refaz o MESMO calculo de hash usando esse salt, e
            // compara o resultado com o hash salvo. Se bater, a senha esta correta.
            var senhaValida = BCrypt.Net.BCrypt.Verify(dto.Senha, usuario.SenhaHash);
            if (!senhaValida)
                return null;

            return GerarToken(usuario);
        }

        private string GerarToken(Usuario usuario)
        {
            // Jwt:Key e uma "senha mestra" guardada no appsettings.json, conhecida
            // so pelo servidor. E ela que assina o token la embaixo (SigningCredentials)
            // — sem essa chave exata, ninguem consegue forjar um token valido.
            var jwtKey = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key nao configurado");
            var jwtIssuer = _configuration["Jwt:Issuer"]; // quem emitiu o token (so informativo)
            var expireMinutes = int.Parse(_configuration["Jwt:ExpireMinutes"] ?? "60"); // token expira sozinho depois desse tempo

            // Claims = as informacoes que vao DENTRO do token, legiveis por qualquer
            // um (nao sao secretas, so nao dao pra alterar sem invalidar a assinatura).
            // E daqui que o ProdutoController.UsuarioId le "quem esta fazendo a requisicao".
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Name, usuario.Nome)
            };

            // Transforma a Jwt:Key (uma string) numa chave criptografica, e monta as
            // credenciais de assinatura usando o algoritmo HMAC-SHA256.
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Monta o token com essas claims, prazo de validade e assinatura.
            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                claims: claims,
                expires: DateTime.Now.AddMinutes(expireMinutes),
                signingCredentials: creds
            );

            // Serializa o token pro formato de texto que o frontend recebe
            // (tres partes separadas por ponto: cabecalho.claims.assinatura).
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
