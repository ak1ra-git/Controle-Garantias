using Garantias.Models;

namespace Garantias.Interfaces
{
    public interface IUsuarioRepository
    {
        Task<Usuario?> ObterPorNomeAsync(string nome);
        Task<Usuario?> ObterPorIdAsync(int id);
        Task<int> CriarAsync(Usuario usuario);
    }
}
