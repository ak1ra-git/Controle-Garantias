using Garantias.DTOs;
using Garantias.Interfaces;
using Garantias.Models;

namespace Garantias.Services
{
    public class ProdutoService : IProdutoService
    {
        private readonly IProdutoRepository _produtoRepository;
        private readonly ICategoriaRepository _categoriaRepository;

        public ProdutoService(IProdutoRepository produtoRepository, ICategoriaRepository categoriaRepository)
        {
            _produtoRepository = produtoRepository;
            _categoriaRepository = categoriaRepository;
        }

        public async Task<IEnumerable<ProdutoDto>> ObterPorUsuarioAsync(int usuarioId)
        {
            var produtos = await _produtoRepository.ObterPorUsuarioAsync(usuarioId);
            var resultado = new List<ProdutoDto>();

            foreach (var produto in produtos)
                resultado.Add(await MontarDtoAsync(produto));

            return resultado;
        }

        public async Task<ProdutoDto?> ObterPorIdAsync(int id, int usuarioId)
        {
            var produto = await _produtoRepository.ObterPorIdAsync(id);
            if (produto == null || produto.CodUsuario != usuarioId)
                return null;

            return await MontarDtoAsync(produto);
        }

        public async Task<int> CriarAsync(ProdutoCreateDto dto, int usuarioId)
        {
            ValidarDatas(dto);

            var produto = new Produto
            {
                Nome = dto.Nome,
                CodCategoria = dto.CodCategoria,
                DataCompra = dto.DataCompra,
                DataVencimento = dto.DataVencimento,
                CodUsuario = usuarioId,
                DataCriacao = DateTime.Now
            };

            return await _produtoRepository.CriarAsync(produto);
        }

        public async Task<bool> AtualizarAsync(int id, ProdutoCreateDto dto, int usuarioId)
        {
            var existente = await _produtoRepository.ObterPorIdAsync(id);
            if (existente == null || existente.CodUsuario != usuarioId)
                return false;

            ValidarDatas(dto);

            var produto = new Produto
            {
                Id = id,
                Nome = dto.Nome,
                CodCategoria = dto.CodCategoria,
                DataCompra = dto.DataCompra,
                DataVencimento = dto.DataVencimento,
                CodUsuario = usuarioId
            };

            return await _produtoRepository.AtualizarAsync(produto);
        }

        public async Task<bool> ExcluirAsync(int id, int usuarioId)
        {
            var existente = await _produtoRepository.ObterPorIdAsync(id);
            if (existente == null || existente.CodUsuario != usuarioId)
                return false;

            return await _produtoRepository.ExcluirAsync(id);
        }

        private static void ValidarDatas(ProdutoCreateDto dto)
        {
            if (dto.DataVencimento <= dto.DataCompra)
                throw new ArgumentException("Data de vencimento deve ser posterior a data de compra.");
        }

        private async Task<ProdutoDto> MontarDtoAsync(Produto produto)
        {
            var categoria = await _categoriaRepository.ObterPorIdAsync(produto.CodCategoria);

            return new ProdutoDto
            {
                Id = produto.Id,
                Nome = produto.Nome,
                CategoriaNome = categoria?.Nome ?? "Sem categoria",
                DataCompra = produto.DataCompra,
                DataVencimento = produto.DataVencimento,
                GarantiaValida = produto.DataVencimento >= DateOnly.FromDateTime(DateTime.Now)
            };
        }
    }
}
