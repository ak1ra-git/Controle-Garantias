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

            var senhaValida = BCrypt.Net.BCrypt.Verify(dto.Senha, usuario.SenhaHash);
            if (!senhaValida)
                return null;

            return GerarToken(usuario);
        }

        private string GerarToken(Usuario usuario)
        {
            var jwtKey = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key nao configurado");
            var jwtIssuer = _configuration["Jwt:Issuer"];
            var expireMinutes = int.Parse(_configuration["Jwt:ExpireMinutes"] ?? "60");

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Name, usuario.Nome)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                claims: claims,
                expires: DateTime.Now.AddMinutes(expireMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
