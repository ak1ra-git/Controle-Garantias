using Garantias.DTOs;

namespace Garantias.Interfaces
{
    public interface IAuthService
    {
        Task<bool> RegistrarAsync(RegistroDto dto);
        Task<string?> LoginAsync(LoginDto dto);
    }
}
