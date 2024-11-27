CREATE TABLE customer (
	customer_id bigint PRIMARY KEY,
	name varchar(250) NOT NULL
);

CREATE TABLE driver (
	driver_id bigint PRIMARY KEY,
 	name varchar(250) NOT NULL,
	description varchar(500) NOT NULL,
	vehicle varchar(100) NOT NULL,
	value decimal NOT NULL,
	km decimal NOT NULL,
);

CREATE TABLE review (
	review_id bigint PRIMARY KEY,
 	rating decimal NOT NULL,
	comment varchar(500) NOT NULL,
	driver_id bigint NOT NULL,
	FOREIGN KEY(driver_id) REFERENCES driver(driver_id)
);

CREATE TABLE ride (
    ride_id serial PRIMARY KEY,
    date timestamp NOT NULL,
    origin varchar(500) NOT NULL,
    destination varchar(500) NOT NULL,
    distance decimal NOT NULL,
    duration varchar(50) NOT NULL,
    value decimal NOT NULL,
    driver_id bigint NOT NULL,
    customer_id bigint NOT NULL,
    FOREIGN KEY(customer_id) REFERENCES customer(customer_id),
    FOREIGN KEY(driver_id) REFERENCES driver(driver_id)
);

-- Dados do motorista
INSERT INTO driver values(1,'Homer Simpson','Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).','Plymouth Valiant 1973 rosa e enferrujado',2.5,1);
INSERT INTO driver values(2,'Dominic Toretto','Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.','Dodge Charger R/T 1970 modificado',5,5);
INSERT INTO driver values(3,'James Bond','Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.','Aston Martin DB5 clássico',10,10);

--Dados das reviews dos motoristas
INSERT INTO review values(1,2,'Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuts.',1);
INSERT INTO review values(2,4,'Que viagem incrível! O carro é um show à parte e o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo!',2);
INSERT INTO review values(3,5,'Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto.',3);

--Dados de usuários ficticios
INSERT INTO customer values(1, 'Shopper');
INSERT INTO customer values(2, 'Leo');