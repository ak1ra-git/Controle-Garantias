namespace Garantias.DTOs
{
    public class ProdutoCreateDto
    {
        public string Nome { get; set; } = string.Empty;
        public int CodCategoria { get; set; }
        public DateOnly DataCompra { get; set; }
        public DateOnly DataVencimento { get; set; }
    }
}
