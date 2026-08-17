using Garantias.Models;

namespace Garantias.Interfaces
{
    public interface ICategoriaService
    {
        Task<IEnumerable<Categoria>> ObterTodasAsync();
    }
}
