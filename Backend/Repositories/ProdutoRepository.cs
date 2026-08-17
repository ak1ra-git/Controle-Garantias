using Dapper;
using Garantias.Interfaces;
using Garantias.Models;
using System.Data;

namespace Garantias.Repositories
{
    public class ProdutoRepository : IProdutoRepository
    {
        private readonly IDbConnection _connection;

        public ProdutoRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task<IEnumerable<Produto>> ObterPorUsuarioAsync(int usuarioId)
        {
            var sql = @"SELECT Id, CodUsuario, CodCategoria, Nome, DataCompra, DataVencimento, DataCriacao
                        FROM produto WHERE CodUsuario = @UsuarioId";
            return await _connection.QueryAsync<Produto>(sql, new { UsuarioId = usuarioId });
        }

        public async Task<Produto?> ObterPorIdAsync(int id)
        {
            var sql = @"SELECT Id, CodUsuario, CodCategoria, Nome, DataCompra, DataVencimento, DataCriacao
                        FROM produto WHERE Id = @Id";
            return await _connection.QueryFirstOrDefaultAsync<Produto>(sql, new { Id = id });
        }

        public async Task<int> CriarAsync(Produto produto)
        {
            var sql = @"INSERT INTO produto (CodUsuario, CodCategoria, Nome, DataCompra, DataVencimento, DataCriacao)
                        VALUES (@CodUsuario, @CodCategoria, @Nome, @DataCompra, @DataVencimento, @DataCriacao);
                        SELECT CAST(SCOPE_IDENTITY() as int);";
            return await _connection.QuerySingleAsync<int>(sql, produto);
        }

        public async Task<bool> AtualizarAsync(Produto produto)
        {
            var sql = @"UPDATE produto SET Nome = @Nome, CodCategoria = @CodCategoria,
                        DataCompra = @DataCompra, DataVencimento = @DataVencimento
                        WHERE Id = @Id AND CodUsuario = @CodUsuario";
            var linhasAfetadas = await _connection.ExecuteAsync(sql, produto);
            return linhasAfetadas > 0;
        }

        public async Task<bool> ExcluirAsync(int id)
        {
            var sql = "DELETE FROM produto WHERE Id = @Id";
            var linhasAfetadas = await _connection.ExecuteAsync(sql, new { Id = id });
            return linhasAfetadas > 0;
        }
    }
}
