using Dapper;
using Garantias.Interfaces;
using Garantias.Models;
using System.Data;

namespace Garantias.Repositories
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly IDbConnection _connection;

        public UsuarioRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task<Usuario?> ObterPorNomeAsync(string nome)
        {
            var sql = "SELECT Id, Nome, SenhaHash, DataCriacao FROM usuario WHERE Nome = @Nome";
            return await _connection.QueryFirstOrDefaultAsync<Usuario>(sql, new { Nome = nome });
        }

        public async Task<Usuario?> ObterPorIdAsync(int id)
        {
            var sql = "SELECT Id, Nome, SenhaHash, DataCriacao FROM usuario WHERE Id = @Id";
            return await _connection.QueryFirstOrDefaultAsync<Usuario>(sql, new { Id = id });
        }

        public async Task<int> CriarAsync(Usuario usuario)
        {
            var sql = @"INSERT INTO usuario (Nome, SenhaHash, DataCriacao)
                        VALUES (@Nome, @SenhaHash, @DataCriacao);
                        SELECT CAST(SCOPE_IDENTITY() as int);";
            return await _connection.QuerySingleAsync<int>(sql, usuario);
        }
    }
}
