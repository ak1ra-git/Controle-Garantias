using Garantias.Interfaces;
using Garantias.Models;

namespace Garantias.Services
{
    public class CategoriaService : ICategoriaService
    {
        private readonly ICategoriaRepository _categoriaRepository;

        public CategoriaService(ICategoriaRepository categoriaRepository)
        {
            _categoriaRepository = categoriaRepository;
        }

        public async Task<IEnumerable<Categoria>> ObterTodasAsync()
        {
            return await _categoriaRepository.ObterTodasAsync();
        }
    }
}
