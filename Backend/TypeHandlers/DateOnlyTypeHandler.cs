using System.Data;
using Dapper;

namespace Garantias.TypeHandlers
{
    // Dapper nao sabe mapear DateOnly/TimeOnly para SQL Server por padrao — o tipo
    // DateOnly so existe desde o .NET 6, e o Dapper nao tem ele na lista de tipos
    // conhecidos. Um TypeHandler e a forma que o Dapper da pra "ensinar" ele a lidar
    // com um tipo novo, sem precisar converter manualmente em cada query do projeto.
    //
    // SqlMapper.TypeHandler<DateOnly> pede dois metodos: um pra escrever (quando o
    // DateOnly esta indo do C# pro banco) e um pra ler (quando esta vindo do banco
    // pro C#). Registrado uma vez em Program.cs, ele passa a valer pra TODO produto
    // do projeto que usa DateOnly (DataCompra e DataVencimento), automaticamente.
    public class DateOnlyTypeHandler : SqlMapper.TypeHandler<DateOnly>
    {
        // Chamado quando o Dapper esta montando um parametro pra mandar pro banco
        // (INSERT, UPDATE, ou um filtro no WHERE). O SQL Server nao entende DateOnly,
        // entao convertemos pra DateTime "a meia-noite" (ToDateTime(TimeOnly.MinValue))
        // e avisamos o driver que o tipo la do banco e DATE (sem hora), via DbType.Date.
        public override void SetValue(IDbDataParameter parameter, DateOnly value)
        {
            parameter.DbType = DbType.Date;
            parameter.Value = value.ToDateTime(TimeOnly.MinValue);
        }

        // Chamado no caminho inverso: quando uma linha volta do SELECT e o Dapper
        // precisa preencher uma propriedade DateOnly (ex: Produto.DataCompra). O
        // driver do SQL Server devolve uma coluna DATE como DateTime — por isso o
        // cast (DateTime)value — e a gente extrai so a parte da data.
        public override DateOnly Parse(object value) => DateOnly.FromDateTime((DateTime)value);
    }
}
