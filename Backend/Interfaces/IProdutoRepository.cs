using Garantias.Models;

namespace Garantias.Interfaces
{
    public interface IProdutoRepository
    {
        Task<IEnumerable<Produto>> ObterPorUsuarioAsync(int usuarioId);
        Task<Produto?> ObterPorIdAsync(int id);
        Task<int> CriarAsync(Produto produto);
        Task<bool> AtualizarAsync(Produto produto);
        Task<bool> ExcluirAsync(int id);
    }
}
