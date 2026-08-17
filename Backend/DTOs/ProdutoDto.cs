namespace Garantias.DTOs
{
    public class ProdutoDto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string CategoriaNome { get; set; } = string.Empty;
        public DateOnly DataCompra { get; set; }
        public DateOnly DataVencimento { get; set; }
        public bool GarantiaValida { get; set; }
    }
}
