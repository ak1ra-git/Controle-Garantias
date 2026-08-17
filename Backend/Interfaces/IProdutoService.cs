using Garantias.DTOs;

namespace Garantias.Interfaces
{
    public interface IProdutoService
    {
        Task<IEnumerable<ProdutoDto>> ObterPorUsuarioAsync(int usuarioId);
        Task<ProdutoDto?> ObterPorIdAsync(int id, int usuarioId);
        Task<int> CriarAsync(ProdutoCreateDto dto, int usuarioId);
        Task<bool> AtualizarAsync(int id, ProdutoCreateDto dto, int usuarioId);
        Task<bool> ExcluirAsync(int id, int usuarioId);
    }
}
