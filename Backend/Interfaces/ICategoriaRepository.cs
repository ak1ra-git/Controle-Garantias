using Garantias.Models;

namespace Garantias.Interfaces
{
    public interface ICategoriaRepository
    {
        Task<IEnumerable<Categoria>> ObterTodasAsync();
        Task<Categoria?> ObterPorIdAsync(int id);
    }
}
