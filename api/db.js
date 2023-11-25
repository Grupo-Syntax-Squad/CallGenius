import { Sequelize, DataTypes } from "sequelize";
import mysql from "mysql";

const PASSWORD = "fatec";

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: PASSWORD
});

const database = new Sequelize('callgenie', 'root', PASSWORD, {
    host: 'localhost',
    dialect: 'mysql'
});

export const Cliente = database.define('Cliente', {
    cli_nome: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    cli_cpf: {
        type: DataTypes.STRING(11),
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    cli_email: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    cli_telefone: {
        type: DataTypes.STRING(11),
    },
    cli_endereco: {
        type: DataTypes.STRING(50),
    },
    cli_cep: {
        type: DataTypes.STRING(8),
    },
    cli_senha: {
        type: DataTypes.STRING(8),
    }
});

export const Chamado = database.define('Chamado', {
    cham_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    cham_titulo: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    cham_descricao: {
        type: DataTypes.STRING(100)
    },
    cham_status: {
        type: DataTypes.ENUM('Aberto', 'Em andamento', 'Concluído', 'Atrasado'),
        defaultValue: 'Aberto'
    },
    cham_data_inicio: {
        type: DataTypes.DATEONLY,
        defaultValue: new Date()
    },
    cham_urgencia: {
        type: DataTypes.ENUM("Baixa", "Média", "Alta", "Urgente"),
        defaultValue: "Média",
        allowNull: false
    },
    cham_prazo: {
        type: DataTypes.VIRTUAL, // Campo virtual que não é armazenado no banco de dados
        defaultValue: new Date(new Date().setDate(new Date().getDate() + 1))
    }
});

Chamado.belongsTo(Cliente, {
    foreignKey: "cham_cli_cpf"
});

export const Adm = database.define("Administrador", {
    adm_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    adm_nome: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    adm_telefone: {
        type: DataTypes.CHAR(11)
    },
    adm_email: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    adm_senha: {
        type: DataTypes.STRING(8)
    }
});

export const Suporte = database.define("Suporte", {
    sup_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    sup_cpf: {
        type: DataTypes.STRING(11),
        unique: true,
        allowNull: false
    },
    sup_nome: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    sup_email: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    sup_telefone: {
        type: DataTypes.STRING(11),
    },
    sup_senha: {
        type: DataTypes.STRING(8),
        allowNull: false
    }
});



export const RespostaChamado = database.define("RespostaChamado", {
    resp_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    resp_soluc_comum: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    resp_data: {
        type: DataTypes.DATEONLY,
        defaultValue: new Date()
    }
});

RespostaChamado.belongsTo(Suporte, {
    foreignKey: "resp_sup_id"
});

RespostaChamado.belongsTo(Chamado, {
    foreignKey: "resp_cham_id"
});

export const Equipamento = database.define("Equipamento", {
    equ_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    equ_nome: {
        type: DataTypes.STRING,
        allowNull: true
    },
    equ_numserie: {
        type: DataTypes.STRING,
        allowNull: true
    },
    equ_tipo: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

Equipamento.belongsTo(Chamado, {
    foreignKey: "equ_cham_id"
});

Equipamento.belongsTo(RespostaChamado, {
    foreignKey: "equ_sup_id"
});


export const Faq = database.define("Faq", {
    faq_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    faq_pergunta: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    faq_resposta: {
        type: DataTypes.STRING(500),
        allowNull: false
    }
});

export const Setor = database.define("Setor", {
    set_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    set_nome: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

Suporte.belongsTo(Setor, {
    foreignKey: "sup_set_id",
    allowNull: false
});

(async () => {
    await database.sync();
    let adm = await Adm.findOne({
        where: {
            adm_nome: "admin"
        }
    });
    if (adm == null) {
        await Adm.create({
            adm_nome: "admin",
            adm_telefone: 12997881456,
            adm_email: "emaildoadm@callgenie.com",
            adm_senha: "fatec",
            adm_id: 12345
        });
    } else {
        console.log("Adm já criado");
    };

    await database.sync();
    let faq = await Faq.findOne({
        where: {
            faq_pergunta: "Como funciona o prazo de resposta?"
        }
    });
    if (faq == null) {
        await Faq.create({
            faq_pergunta: "Como funciona o prazo de resposta?",
            faq_resposta: "O prazo de resposta é o o tempo limite que os nossos suportes terão para responder o chamado. O prazo varia conforme a prioridade do chamado. É possível verificar o prazo de resposta após abrir um chamado.",
        });
        await Faq.create({
            faq_pergunta: "Como imprimir um relatório de chamado?",
            faq_resposta: "Na página Meus chamados, selecione o chamado que você deseja imprimir um relatório, é possível selecionar mais de um. Após selecionado(s) clique no botão Relatório e em seguida, Imprimir. Lembrando que o relatório só pode ser gerado caso o chamado já tenha sido concluído.",
        });
        await Faq.create({
            faq_pergunta: "É possível abrir um chamado sem possuir conta no Callgenie?",
            faq_resposta: "É preciso que o cliente se cadastre ou faça Login para ter acesso às funcionalidades do sistema.",
        });
        await Faq.create({
            faq_pergunta: "Como saber se o suporte respondeu o meu chamado?",
            faq_resposta: "Na página Meus chamados, selecione o chamado que você deseja verificar se há uma resposta. Se houver resposta, clique no botão Ver reposta do chamado. O botão só aparecerá se houver respostas.",
        });
        await Faq.create({
            faq_pergunta: "Esqueci minha senha, como faço para recuperá-la?",
            faq_resposta: "Na manual do usuário, há um e-mail de contato, envie uma mensagem para este e-mail, no título do e-mail escreva: 'Esqueci minha senha' . No assunto do e-mail coloque o seu CPF, adicionalmente você também pode enviar seu nome, telefone e outras infomações que julgue serem importantes para identifica-lo. Sua senha será enviada via e-mail.",
        });
        await Faq.create({
            faq_pergunta: "Como faço para saber o número de série do meu equipamento?",
            faq_resposta: "No ato da compra de quaisquer equipamentos em nossa loja, sempre emitimos um comprovante de compra contendo todas as informações técnicas do produto. Caso você não possua este documento ou seu equipamento não tenha sido comprado conosco, você pode abrir um chamado requisitando ajuda para ientificar o número de série.",
        });
        await Faq.create({
            faq_pergunta: "Qual deve ser a prioridade de meu chamado?",
            faq_resposta: "Recomendamos que para obter informações sobre equipamentos e produtos, a prioridade seja baixa. Para problemas técnicos, a prioridade deve ser média. Para problemas técnicos urgentes, a prioridade deve ser alta. Para problemas técnicos urgentes que estejam afetando o funcionamento de sua empresa, a prioridade deve ser urgente.",
        });
    } else {
        console.log("Faq já criado");
    };
})();
