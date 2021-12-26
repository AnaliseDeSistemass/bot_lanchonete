
      const express = require("express");
      const app = express();
      const axios = require ('axios');
      const {WebhookClient} = require('dialogflow-fulfillment');
      const PORT = process.env.PORT || 3000;

      app.get('/', function (req, res) {
        res.send('PIZZARIA GUAJARÁ ONLINE');
      });

      app.post('/pizzaria', express.json(), function (req, res) {
        const agent = new WebhookClient({ request:req, response:res });
        console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
        console.log('Dialogflow Request body: ' + JSON.stringify(req.body));

        function welcome(agent) {
          agent.add(`Welcome to my agent!`);
        }

        function fallback(agent) {
          agent.add(`I didn't understand`);
          agent.add(`I'm sorry, can you try again?`);
        }
        
       
       
        async function consultarEstado(agent){
          let NumeroPedido = agent.parameters["NumeroPedido"];
          let response = await axios.get("https://sheet.best/api/sheets/1cfef018-d9a2-4087-8d18-930062bdbc58/NumeroPedido/"+NumeroPedido);
          let consultas = response.data;
          if(consultas.length>0){
            let consulta = consultas[0];
              agent.add("Segue os dados do seu pedido: "+consulta.Estado)
          }else {
          agent.add("Número do pedido informado não existe! Informe um número válido");
          } 
       }


        function confirmar(agent){
        agent.add("Seu pedido já esta sendo preparado e saindo para entrega!");
        agent.add('Aguarde entre 30 à 50 minutos para receber o seu pedido.')
        agent.add("A Pizzaria  *Guajará*  agradece seu contato, até logo👋");

        }
  
      function gravarpedido(agent){

        let nome = agent.parameters.nome;
        let fone = agent.parameters.fone;
        let sabor = agent.parameters.sabor;
        let quantidade = agent.parameters.quantidade;
        //let borda = agent.parameters.borda;
        let bebida= agent.parameters.bebida;
        let pagamento = agent.parameters.pagamento;
        let troco = agent.parameters.troco;
        let endereco = agent.parameters.endereco;
        let NumeroPedido = Date.now();
        axios.post("https://sheet.best/api/sheets/1cfef018-d9a2-4087-8d18-930062bdbc58",{nome,fone,sabor,quantidade,bebida,pagamento,troco,endereco,NumeroPedido});
      
        var total=agent.parameters.total;
        total=0;
        
    
        //Pizza 
       if (sabor === 'Calabresa'){ 
         total=26.00*quantidade+total;
       }
       else if (sabor === 'Mussarela'){ 
         total=26.00*quantidade+total;
       }
       else if(sabor === 'Frango'){ 
         total=26.00*quantidade+total;
       }
       else if (sabor === 'Mista'){ 
         total=26.00*quantidade+total;
       } 
       else if (sabor === 'Peito de Peru'){
          total=32.00*quantidade+total;
       }
       else if (sabor === 'Toscana'){
          total=32.00*quantidade+total;
       }  
       else if (sabor === 'Portuguesa'){
          total=32.00*quantidade+total;
       }  
       else if (sabor === 'Frango C/ Catupiry'){
          total=32.00*quantidade+total;
       }  
       else if (sabor === '4 Queijos'){
          total=32.00*quantidade+total;
       }  
       else if (sabor === 'Calabresa C/ Fritas'){
          total=32.00*quantidade+total;
       }  
    
      /*  //borda
    
       if (borda == 'Catupiry'){
         total=total+6.00;
      }
       else if (borda == 'Cheddar'){
         total=total+7.00;
      }
       else if (borda == 'Mussarela'){
         total=total+8.00;
      }
       else if (borda == 'Sem borda'){
        total=total+0; 
      } */
    
    //bebidas
    
      if (bebida == 'Coca 1LT'){
        total=total+5.00;
      }
      else if(bebida =='Coca 2LT'){
        total=total+7.00;
      }
      else if(bebida == 'Garoto'){
        total=total+6.00;
      }
      else if (bebida == 'Sukita'){
       total=total+5.00;
      }
      else if (bebida == 'sem bebida'){
        total=total+0;
      }  
        
        // DETALHAMENTO DO PEDIDO
       agent.add("*======RESUMO DO SEU PEDIDO======*" + 
       "\n" + "\n" +"\n *N° DO PEDIDO*: "+"*" +NumeroPedido+ "*" + "" +         
       "\n *NOME*: " + "*"+nome+"*" + "" +
       "\n *FONE*: " + "*"+fone+"*" + "" +             
       "\n *SABOR DA PIZZA*: " + "*"+sabor+"*" + "" +
       "\n *QUANTIDADE*: " + "*"+quantidade+"*" + "" +          
       //"\n *BORDA*: " + "*"+borda+"*" + "" +
       "\n *BEBIDA*: " + "*"+bebida+"*" + "" +
       //"\n QUANTIDADE: " + "*"+quantidadebebida+"*" + "" +            
       "\n *FORMA DE PAGAMENTO*: " + "*"+pagamento+"*" + "" +
       "\n *TROCO*: " + "*"+troco+"*" + "" +
       "\n *ENDEREÇO PARA ENTREGA*:  " + "*"+endereco+"*" + ""+ "\n" + "\n" +
       '*VALOR TOTAL* : *R$* '+total.toFixed(2));


      let Estado = "Confirmado";

      agent.add("Para confirmar Digite *OK* ou *DROCHA*😁," +"  para cancelar digite *CANCELAR*" );

      }
  

      function agradecimentos(agent) {
          agent.add(`A *Pizzaria Guajará* agradece sua preferência, até a proxima!`);

        }

        let intentMap = new Map();
        intentMap.set('Default Welcome Intent', welcome);
        intentMap.set('Default Fallback Intent', fallback);
        intentMap.set('agradecimentos', agradecimentos);
        intentMap.set('Pedido', gravarpedido);
        intentMap.set('confirmar', confirmar);
        intentMap.set('Estado.consultar', consultarEstado);
        agent.handleRequest(intentMap);

      });

     /*  function pesquisa(agent) {
          var nome = agent.parameters["nome"];
          return axios.get("https://sheet.best/api/sheets/1cfef018-d9a2-4087-8d18-930062bdbc58").then(res => {
          res.data.map(coluna => {
            if (coluna.nome === nome)
              agent.add({
                fulfillmentText:
                "CONFIRME SEUS DADOS:" +
                "Se estiver correto digite *OK*" +
                "\n" +
                "\n" +
              });
          });
        });
            
      });      
      */

        // listen for requests :)
          app.listen(PORT, () => {
          console.log("executando na porta "+ PORT);
      });
