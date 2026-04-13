const createPlayers = (category, names) => {
  return names.map((name, index) => ({
    id: `${category}-${index + 1}`,
    name,
    category,
    height: `${(1.6 + Math.random() * 0.3).toFixed(2)}m`,
    weight: `${(55 + Math.random() * 30).toFixed(0)}kg`,
    position: ['Forward', 'Midfielder', 'Defender', 'Goalkeeper', 'Winger'][Math.floor(Math.random() * 5)],
    initial: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    status: 'Active'
  }));
};

export const initialPlayersData = [
  ...createPlayers('U12', ['Lucas Silva', 'Pedro Santos', 'Tiago Oliveira', 'Enzo Costa', 'Hugo Ferreira', 'Leo Souza', 'Max Lima', 'Davi Pereira', 'Igor Rocha', 'Theo Alves', 'Gael Ribeiro', 'Noah Carvalho', 'Ravi Gomes', 'Yuri Martins', 'Cauã Barbosa', 'Ruan Cardoso', 'Luiz Melo', 'Eric Teixeira', 'Alan Barros', 'Ryan Nunes']),
  ...createPlayers('U14', ['André Martins', 'Bruno Silva', 'Vitor Hugo', 'Caio Ribeiro', 'Daniel Souza', 'Edson Lima', 'Fábio Costa', 'Gerson Rocha', 'Hélio Pereira', 'Ítalo Santos', 'Jonas Alves', 'Kadu Ferreira', 'Luan Gomes', 'Mário Oliveira', 'Nilo Carvalho', 'Otto Martins', 'Paulo Santos', 'Régis Barros', 'Silas Rocha', 'Túlio Cardoso']),
  ...createPlayers('U16', ['Arnaldo Pereira', 'Bento Ribeiro', 'Cadu Silva', 'Dudu Souza', 'Elias Rocha', 'Fred Lima', 'Guto Costa', 'Hugo Alves', 'Ivan Santos', 'Juca Ferreira', 'Kaio Gomes', 'Léo Martins', 'Miro Oliveira', 'Nenê Carvalho', 'Oscar Barros', 'Pipo Rocha', 'Quico Santos', 'Riva Silva', 'Sassá Costa', 'Tico Pereira']),
  ...createPlayers('U18', ['Vinicius Jr', 'Rodrygo Goes', 'Gabriel Martinelli', 'Endrick Felipe', 'Vitor Roque', 'Marcos Leonardo', 'Andrey Santos', 'Robert Renan', 'Kayky Silva', 'Savinho Ribeiro', 'Giovani Souza', 'Matheus França', 'Vitor Hugo', 'Renyer Martins', 'Ângelo Gabriel', 'Matheus Nascimento', 'Luis Guilherme', 'Estêvão Willian', 'Lorran Lucas', 'Rayan Victor']),
  ...createPlayers('U20', ['Danilo Santos', 'João Gomes', 'Gabriel Menino', 'Patrick de Paula', 'Gabriel Veron', 'Kaio Jorge', 'Yuri Alberto', 'Praxedes', 'Maurício Souza', 'Sandry Roberto', 'Luan Patrick', 'Lucas Calegari', 'Matheus Martinelli', 'Abner Vinicius', 'Wanderson Silva', 'Bruno Gomes', 'Richard Rios', 'Zé Gabriel', 'Caio Paulista', 'Igor Gomes']),
  ...createPlayers('SENIOR', ['Neymar Jr', 'Casemiro', 'Marquinhos', 'Thiago Silva', 'Alisson Becker', 'Ederson Moraes', 'Richarlison', 'Lucas Paquetá', 'Raphinha', 'Bruno Guimarães', 'Gabriel Magalhães', 'Éder Militão', 'Bremer', 'Alex Telles', 'Danilo Luiz', 'Fred Rodrigues', 'Fabinho Tavares', 'Antony Santos', 'Gabriel Jesus', 'Rodrygo Goes'])
];
