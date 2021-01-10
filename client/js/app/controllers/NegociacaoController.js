class NegociacaoController {

    constructor() {

        let $ = document.querySelector.bind(document);

        this._inputData = $("#data");
        this._inputQuantidade = $("#quantidade");
        this._inputValor = $("#valor");

        this._listaNegociacoes = new Bind(
            new ListaNegociacoes(),
            new NegociacoesView($("#negociacoesView")),
            "adicionar", "limpar", "ordenar", "inverterOrdem"
        )

        this._mensagem = new Bind(
            new Mensagem(),
            new MensagemView($("#mensagemView")),
            "texto"
        )

        this._ordemAtual = "";
    }

    adicionar(evento) {

        try {
            evento.preventDefault();
            this._listaNegociacoes.adicionar(this._criarNegociacao());
            this._mensagem.texto = "Negociação adicionada com sucesso!";
            this._limparCampos();
        } catch (error) {
            this._mensagem.texto = error;
        }
    }

    importarNegociacoes() {

        let service = new NegociacaoService();

        service
            .obterNegociacoes()
            .then(negociacoes => {
                negociacoes.forEach(negociacao => this._listaNegociacoes.adicionar(negociacao));
                this._mensagem.texto = 'Negociações do período importadas com sucesso';
            })
            .catch(erro => this._mensagem.texto = erro);
    }

    limparNegociacoes() {

        this._listaNegociacoes.limpar();
        this._mensagem.texto = "Negociações apagadas com sucesso";
    }

    _criarNegociacao() {

        return new Negociacao(
            DataHelper.textoParaData(this._inputData.value),
            this._inputQuantidade.value,
            this._inputValor.value
        )
    }

    _limparCampos() {
        this._inputData.value = "";
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0;

        this._inputData.focus();
    }

    ordenar(coluna) {

        if (this._ordemAtual == coluna) {
            this._listaNegociacoes.inverterOrdem()
        }
        else {
            this._listaNegociacoes.ordenar((a, b) => a[coluna] - b[coluna])
        }
        this._ordemAtual = coluna
    }

}