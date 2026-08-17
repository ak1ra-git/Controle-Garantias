using Garantias.DTOs;
using Garantias.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Garantias.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProdutoController : ControllerBase
    {
        private readonly IProdutoService _produtoService;

        public ProdutoController(IProdutoService produtoService)
        {
            _produtoService = produtoService;
        }

        private int UsuarioId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<IActionResult> ObterTodos()
        {
            var produtos = await _produtoService.ObterPorUsuarioAsync(UsuarioId);
            return Ok(produtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> ObterPorId(int id)
        {
            var produto = await _produtoService.ObterPorIdAsync(id, UsuarioId);
            if (produto == null)
                return NotFound();

            return Ok(produto);
        }

        [HttpPost]
        public async Task<IActionResult> Criar(ProdutoCreateDto dto)
        {
            try
            {
                var id = await _produtoService.CriarAsync(dto, UsuarioId);
                return CreatedAtAction(nameof(ObterPorId), new { id }, null);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Atualizar(int id, ProdutoCreateDto dto)
        {
            try
            {
                var sucesso = await _produtoService.AtualizarAsync(id, dto, UsuarioId);
                if (!sucesso)
                    return NotFound();

                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Excluir(int id)
        {
            var sucesso = await _produtoService.ExcluirAsync(id, UsuarioId);
            if (!sucesso)
                return NotFound();

            return NoContent();
        }
    }
}
