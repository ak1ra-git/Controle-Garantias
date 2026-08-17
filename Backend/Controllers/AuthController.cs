using Garantias.DTOs;
using Garantias.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Garantias.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("registrar")]
        public async Task<IActionResult> Registrar(RegistroDto dto)
        {
            var sucesso = await _authService.RegistrarAsync(dto);
            if (!sucesso)
                return Conflict("Usuario ja existe.");

            return Ok("Usuario registrado com sucesso.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var token = await _authService.LoginAsync(dto);
            if (token == null)
                return Unauthorized("Usuario ou senha invalidos.");

            return Ok(new { token });
        }
    }
}
