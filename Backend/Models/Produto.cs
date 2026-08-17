namespace Garantias.Models
{
    public class Produto
    {
        public int Id { get; set; }
        public int CodUsuario { get; set; }
        public int CodCategoria { get; set; }
        public string Nome { get; set; } = string.Empty;
        public DateOnly DataCompra { get; set; }
        public DateOnly DataVencimento { get; set; }
        public DateTime DataCriacao { get; set; }
    }
}
