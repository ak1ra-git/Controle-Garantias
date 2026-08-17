using Dapper;
using Garantias.Interfaces;
using Garantias.Models;
using System.Data;

namespace Garantias.Repositories
{
    public class CategoriaRepository : ICategoriaRepository
    {
        private readonly IDbConnection _connection;

        public CategoriaRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task<IEnumerable<Categoria>> ObterTodasAsync()
        {
            var sql = "SELECT Id, Nome FROM categoria ORDER BY Nome";
            return await _connection.QueryAsync<Categoria>(sql);
        }

        public async Task<Categoria?> ObterPorIdAsync(int id)
        {
            var sql = "SELECT Id, Nome FROM categoria WHERE Id = @Id";
            return await _connection.QueryFirstOrDefaultAsync<Categoria>(sql, new { Id = id });
        }
    }
}
