var Request = require('request-promise');
var rp = require('request-promise');

var NODE_PATH = '/yandex-alice-command/';

var y_alice = require('../lib/y_alice.js');

module.exports = function(RED)
{
    RED.httpAdmin.get(NODE_PATH + 'static/*', function (req, res) {
        var options = {
            root: __dirname + '/static/',
            dotfiles: 'deny'
        };
        res.sendFile(req.params[0], options);
    });


    function Y_Alice_Send(config)
    {
        RED.nodes.createNode(this, config);

//        this.login = RED.nodes.getNode(node.config.login);
        this.login = config.login;
        this.login_node = RED.nodes.getNode(this.login);
        this.command_type = config.command_type;

        this.username = this.login_node.username;
        this.password = this.login_node.password;
        this.token = this.login_node.token;
        this.cookies = this.login_node.cookies;
        this.speaker_name = this.login_node.speaker_name;
        this.scenario_name = this.login_node.scenario_name;
        this.speaker_id = this.login_node.speaker_id;
        this.scenario_id = this.login_node.scenario_id;

        this.debug_enable = this.login_node.debug_enable;
//        this.debug_enable = true;


//this.user = this.login_node.username;
//this.pass = this.login_node.password;

/*
        this.username = config.username;
        this.password = config.password;
        this.token = config.token;
        this.cookies = config.cookies;
        this.speaker_name = config.speaker_name;
        this.scenario_name = config.scenario_name;
        this.speaker_id = config.speaker_id;
        this.scenario_id = config.scenario_id;
*/

        var node = this;
//node.log('debug is ' + this.debug_enable);

       function Debug_Log(msg_text)
       {
//         if (!node.debug_enable) {return;}
         node.log(msg_text);
         var msg = {};
         msg.payload = msg_text;
         node.send(msg);
       }

        node.on('input', function(msg)
        {

//node.send("login username is " + node.user);
//node.send("login password is " + node.pass);

          var text = '';
          var is_cmd = false;

          if (node.command_type == 'tts')
          {
            is_cmd = false;
            text = msg.payload;
          }
          else if (node.command_type == 'cmd')
          {
            is_cmd = true;
            text = msg.payload;
          }
          else if (node.command_type == 'json')
          {
            cmd_data = msg.payload;
            if (cmd_data.type == 'cmd')
            {
              is_cmd = true;
              text = cmd_data.text;
            }
            else if (cmd_data.type == 'tts')
            {
              is_cmd = false;
              text = cmd_data.text;
            }
            if (typeof(text) == "undefined" && text == null)
            {
              text = 'Ошибка';
            }
          }


          var is_debug = node.debug_enable;
          var csrf_token = '';

          var default_scenario = "Голос";

          var token = node.token;
          var cookies = node.cookies;
          var scenario_id = node.scenario_id;
          var speaker_id = node.speaker_id;
          var speaker_name = node.speaker_name;
          var scenario_name = node.scenario_name;


          var is_speaker_name_set = false;
          var is_token_set = false;
          var is_cookies_set = false;
          var is_speaker_set = false;
          var is_scenario_set = false;

          var is_found_scenario = false;


          var is_fail_token = false;
          var is_fail_csrf_token = false;
          var is_fail_cookies = false;
          var is_fail_scenario = false;
          var is_fail_scenario_add = false;
          var is_fail_scenario_update = false;
          var is_fail_scenario_run = false;
          var is_fail_speaker = false;

//          node.send("token is " + token);
//          node.send("cookies is " + cookies);

/////////////// IF NOT SET TOKEN OR COOKIE : GET IT Begin ////////
//          if (true)
          if (typeof(token) != "undefined" && token !== null)
          {
            if (token.length > 0)
            {
              is_token_set = true;
              token = token.replace(new RegExp('"', 'g'), '');
            }
          }

          if (typeof(cookies) != "undefined" && cookies !== null)
          {
            if (cookies.length > 0)
            {
              is_cookies_set = true;
              cookies = cookies.replace(new RegExp('"', 'g'), '');
            }
          }

          if (typeof(scenario_id) != "undefined" && scenario_id !== null)
          {
            if (scenario_id.length > 0)
            {
              is_scenario_set = true;
              scenario_id = scenario_id.replace(new RegExp('"', 'g'), '');
            }
          }

          if (typeof(speaker_id) != "undefined" && speaker_id !== null)
          {
            if (speaker_id.length > 0)
            {
              is_speaker_set = true;
              speaker_id = speaker_id.replace(new RegExp('"', 'g'), '');
            }
          }

          if (typeof(speaker_name) != "undefined" && speaker_name !== null)
          {
            if (speaker_name.length > 0)
            {
              is_speaker_name_set = true;
              speaker_name = speaker_name.replace(new RegExp('"', 'g'), '');
            }
          }

          if (typeof(scenario_name) != "undefined" && scenario_name !== null)
          {
            if (scenario_name.length > 0)
            {
              scenario_name = scenario_name.replace(new RegExp('"', 'g'), '');
            }
            else
            {
              scenario_name = default_scenario;
            }
          }
          else
          {
            scenario_name = default_scenario;
          }


        node.status({}); //clean


        async function make_action()
        {
              function redirect_go(body, response, resolveWithFullResponse)
              {
                if (is_debug) {Debug_Log("Get cookies: stage 2: redirect");}
//                node.send(body);
//                node.send(resolveWithFullResponse);
                var headers = response.headers;
//                node.send(headers);
                cookies = '';
                headers['set-cookie'].forEach(function(item, i, arr)
                {
                  tmp_cookie = item.substring(0, item.indexOf('; ')) + ";";
//                  node.send("cookie " + i + " is " + tmp_cookie);
                  cookies += tmp_cookie;
                });
//                node.send("full cookies is " + cookies);
///////////////// SEND MESSAGE IN THIS STRING ///////////
                if (response.statusCode === 302) {} else {}
              }
//////// function for get cookie on login end /////



          if (!is_token_set)
          {
/////////////// GET MAIN TOKEN Begin //////////////
          if (is_debug) {Debug_Log("Get token: begin");}

          var encode_username = encodeURIComponent(node.username);
          var encode_password = encodeURIComponent(node.password);

//          if (is_debug) {Debug_Log("Get token: login string is " + 'client_secret=' + y_alice.client_secret + '&client_id=' + y_alice.client_id + '&grant_type=' + 'password' + '&username=' + node.username + '&password=' + node.password);}
//          if (is_debug) {Debug_Log("Get token: login string is " + 'client_secret=' + y_alice.client_secret + '&client_id=' + y_alice.client_id + '&grant_type=' + 'password' + '&username=' + encode_username + '&password=' + encode_password);}

          var options =
          {
            method: 'POST',
            uri: 'https://oauth.yandex.ru/token',
            body: 'client_secret=' + y_alice.client_secret + '&client_id=' + y_alice.client_id + '&grant_type=' + 'password' + '&username=' + encode_username + '&password=' + encode_password,
//            body: 'client_secret=' + y_alice.client_secret + '&client_id=' + y_alice.client_id + '&grant_type=' + 'password' + '&username=' + node.username + '&password=' + node.password,
             headers: {
        /* 'content-type': 'application/x-www-form-urlencoded' */ // Is set automatically
            },
            resolveWithFullResponse: true,
            json: false // Automatically stringifies the body to JSON
          };


          await rp(options) /////// get token
          .then(function (body)
          {
            var data = JSON.parse(body.body);
            token = data.access_token;
            if (is_debug) {Debug_Log("Get token: ok");}
//            if (is_debug) {Debug_Log("get token - ok : " + token);}
//            node.send(token);

//            node.send("TRY GET COOKIES with token " + token);
          })
          .catch(function (err) {
          is_fail_token = true;
          Debug_Log("Get token: fail " + err);
          node.status({
            fill: "red",
            shape: "dot",
            text: "Alice:token:error:" + err
          });

//          if (err.indexOf('login or password is not valid') > -1) {Debug_Log('Login or password is not valid');}
//          if (err.error_description.indexOf('login or password is not valid') > -1) {Debug_Log('Login or password is not valid');}
        });
/////////////// GET MAIN TOKEN End //////////////
}

          if (!is_cookies_set && !is_fail_token)
          {

          if (is_debug) {Debug_Log("Get cookies: begin");}


/////////////// GET COOKIES Begin //////////////
            var passport_host = '';
            var track_id = '';

            var options =
            {
              method: 'POST',
              uri: 'https://registrator.mobile.yandex.net/1/bundle/auth/x_token/',
              body: 'type=' + 'x-token' + '&retpath=' + 'https://www.yandex.ru/androids.txt',
              headers: {
                 'Content-type' : 'application/x-www-form-urlencoded',
                 'Ya-Consumer-Authorization' : 'OAuth ' + token
              },
              resolveWithFullResponse: true,
              json: false // Automatically stringifies the body to JSON
            };


            await rp(options)
            .then(function (body)
            {
              var data_2 = JSON.parse(body.body);
              passport_host = data_2.passport_host;
              track_id = data_2.track_id;
//            node.send(token);
//              node.send("get cookie - status : " + cookie_data.status);
//              node.send(body);
            })
            .catch(function (err) {
//              node.send("get cookie - fail " + err);
            });


              if (is_debug) {Debug_Log("Get cookies: stage 2: begin");}
              var options =
              {
                method: 'POST',
                uri: passport_host + '/auth/session/' + '?track_id=' + track_id,
//                body: 'type=' + 'x-token' + '&retpath=' + 'https://www.yandex.ru/androids.txt',
                headers: {
                   'Content-type' : 'application/x-www-form-urlencoded',
                   'Ya-Consumer-Authorization' : 'OAuth ' + token
                },
                resolveWithFullResponse: true,
                json: false, // Automatically stringifies the body to JSON
                followRedirect: false,
                followAllRedirects : false,
                transform: redirect_go
              };


              await rp(options)
              .then(function (body)
              {
                var cookie_2_data = JSON.parse(body.body);
//              passport_host = cookie_data.passport_host;
//              track_id = cookie_data.track_id;
//            node.send(token);
//              node.send("get cookie stage 2 - status : ");
//              node.send(body);


              })
              .catch(function (err) {
//                node.send(body);
//                node.send("get cookie stage 2  - fail " + err);
              });

/////////////// GET COOKIES End //////////////
          }
/////////////// IF NOT SET TOKEN OR COOKIE : GET IT End ////////


/////////////// GET CSRF TOKEN Begin //////////////
          if (!is_fail_token && !is_fail_cookies)
          {
            if (is_debug) {Debug_Log("Get csrf token: begin");}
            var options =
            {
//              method: 'POST',
              uri: 'https://yandex.ru/quasar/iot',
//              body: 'client_secret=' + y_alice.client_secret + '&client_id=' + y_alice.client_id + '&grant_type=' + 'password' + '&username=' + node.username + '&password=' + node.password,
              headers: {
                 'Content-type' : 'application/x-www-form-urlencoded',
                 'Ya-Consumer-Authorization' : 'OAuth ' + token,
                 'Cookie' : cookies
              },
              resolveWithFullResponse: true,
              json: false // Automatically stringifies the body to JSON
            };

            await rp(options) ///// get csrf
            .then(function (body)
            {
//              var data = JSON.parse(body.body);
//              token = data.access_token;
              if (is_debug) {Debug_Log("Get csrf token: ok");}
              tmp_body = body.body;
              tmp_csrf_token = tmp_body.substring(tmp_body.indexOf('"csrfToken2":"'));
              tmp_csrf_token = tmp_csrf_token.substring(tmp_csrf_token.indexOf('":"'), tmp_csrf_token.indexOf('","'));
/// this for all subsrt replace
              tmp_csrf_token = tmp_csrf_token.replace(new RegExp('":"', 'g'), '');
//             tmp_csrf_token = tmp_csrf_token.replace('":"','');
              csrf_token = tmp_csrf_token;
//              node.send("csrf token is " + csrf_token);

//              node.send(body);
//node.send(body.body);
            })
            .catch(function (err)
            {
              node.send(err);
              is_fail_csrf_token = true;
              if (is_debug) {Debug_Log("Get csrf token: fail " + err);}
              node.status({
                fill: "red",
                shape: "dot",
                text: "Alice:csrf token:error:" + err
              });
              return;
            });
          }
/////////////// GET CSRF TOKEN End //////////////





//          node.send(msg);


          if (!is_speaker_set && !is_fail_token && !is_fail_cookies)
          {
            var devices_data = '';
/////////////// GET devices Begin //////////////
            if (is_debug) {Debug_Log("Get devices: begin");}
            var options =
            {
//              method: 'POST',
              uri: 'https://iot.quasar.yandex.ru/m/user/devices',
//              body: 'client_secret=' + y_alice.client_secret + '&client_id=' + y_alice.client_id + '&grant_type=' + 'password' + '&username=' + node.username + '&password=' + node.password,
              headers: {
                 'Content-type' : 'application/x-www-form-urlencoded',
                 'Ya-Consumer-Authorization' : 'OAuth ' + token,
                 'Cookie' : cookies
              },
              resolveWithFullResponse: true,
              json: false // Automatically stringifies the body to JSON
            };

            await rp(options) ///// get devices
            .then(function (body)
            {
              if (is_debug) {Debug_Log("Get devices: ok");}
//              node.send(body);
              devices_data = JSON.parse(body.body);
            })
            .catch(function (err)
            {
              node.send(err);
              is_fail_speaker = true;
              if (is_debug) {Debug_Log("Get devices: fail " + err);}
              node.status({
                fill: "red",
                shape: "dot",
                text: "Alice:devices:error:" + err
              });
            });
/////////////// GET devices End //////////////

/////////////// GET Search SPEAKER Begin //////////////
//        if (device_data.rooms.length > 0)
        if (typeof(devices_data.rooms) != "undefined" && devices_data.rooms != null && !is_fail_speaker)
        {
          devices_data.rooms.forEach(function(item, i, arr)
          {
//          node.send("room " + i + " name is " + item.name);
            room_devices = item.devices;
            room_devices.forEach(function(device_item, i, arr)
            {
              if (device_item.type.indexOf("devices.types.smart_speaker") > -1 || device_item.type.indexOf("yandex.module") > -1)
              {
                if (is_speaker_name_set)
                {
                  if (device_item.name.indexOf(speaker_name) > -1)
                  {
//                    node.send("found NAMED spekaer is " + device_item.name);
                    speaker_id = device_item.id;
                  }
                }
                else
                {
//                node.send("found speaker is " + device_item.name);
                  speaker_id = device_item.id;
                  if (is_debug) {Debug_Log("Get devices: found speaker ID is " + speaker_id);}
                }
              }
            });
          });


        }
        else
        {
          if (is_debug) {Debug_Log("Get devices: error: no devices in account");}
        }
////         node.send("room is " + devices.rooms[0].name);
/////////////// GET Search SPEAKER End //////////////
         }

/////////////// GET VERIFY SPEAKER Begin //////////////
          if (typeof(speaker_id) == "undefined" || speaker_id == null)
          {
            is_fail_speaker = true;
            if (is_debug) {Debug_Log("Get devices: error: no speakers in account");}
          }
          else if (speaker_id.length < 2)
          {
            is_fail_speaker = true;
            if (is_debug) {Debug_Log("Get devices: error: no speaker in account");}
          }
/////////////// GET VERIFY SPEAKER End //////////////



          if (!is_scenario_set && !is_fail_token && !is_fail_cookies)
          {
            var scenarios_data = '';
/////////////// GET scenarios Begin //////////////
            if (is_debug) {Debug_Log("Get scenarios: begin");}
            var options =
            {
//              method: 'POST',
              uri: 'https://iot.quasar.yandex.ru/m/user/scenarios',
//              body: 'client_secret=' + y_alice.client_secret + '&client_id=' + y_alice.client_id + '&grant_type=' + 'password' + '&username=' + node.username + '&password=' + node.password,
              headers: {
                 'Content-type' : 'application/x-www-form-urlencoded',
                 'Ya-Consumer-Authorization' : 'OAuth ' + token,
                 'Cookie' : cookies
              },
              resolveWithFullResponse: true,
              json: false // Automatically stringifies the body to JSON
            };

            await rp(options) ///// get scenarios
            .then(function (body)
            {
//              var data = JSON.parse(body.body);
              if (is_debug) {Debug_Log("Get scenarios: ok");}
//              node.send(body);
              scenarios_data = JSON.parse(body.body);
            })
            .catch(function (err)
            {
              node.send(err);
              is_fail_scenario = true;
              if (is_debug) {Debug_Log("Get scenarios: fail " + err);}
              node.status({
                fill: "red",
                shape: "dot",
                text: "Alice:scenarios:get:error:" + err
              });
            });
/////////////// GET scenarios End //////////////
/////////////// GET Search SCENARIO Begin //////////////
        if (typeof(scenarios_data.scenarios) != "undefined" && scenarios_data.scenarios != null && !is_fail_scenario)
        {
          scenarios_data.scenarios.forEach(function(item, i, arr)
          {
//            node.send("scenarios " + i + " name is " + item.name);
            if (item.name.indexOf(scenario_name) > -1)
            {
//              node.send("found scenario is " + item.name);
              scenario_id = item.id;
              is_found_scenario = true;
            }
          });
        }
        else
        {
          if (is_debug) {Debug_Log("Get scenarios: no scenarios in account");}
        }

////         node.send("room is " + devices.rooms[0].name);
/////////////// GET Search SCENARIO End //////////////

/////////////// GET ADD SCENARIO Begin //////////////
           if (is_found_scenario)
           {
             if (is_debug) {Debug_Log("Get scenarios: found scenario ID is " + scenario_id);}
           }
           else
           {
              if (is_debug) {Debug_Log("Add scenario: begin");}

              var send_data = {};
//              send_data.push(new Object());
              send_data.name = scenario_name;
              send_data.icon = new String('home');
              send_data.trigger_type = new String('scenario.trigger.voice');
              send_data.devices = new Array();
              send_data.external_actions = new Array();
              send_data.external_actions.push(new Object());
              send_data.external_actions[0].type = new String('scenario.external_action.phrase');
              send_data.external_actions[0].parameters = {};
              send_data.external_actions[0].parameters.current_device = new Boolean(false);
              send_data.external_actions[0].parameters.device_id = new String(speaker_id);
              send_data.external_actions[0].parameters.phrase = new String('-');
//              node.send(send_data);
              send_data_str = JSON.stringify(send_data);
//              node.send("to send : " + send_data_str);

              var options =
              {
                method: 'POST',
                uri: 'https://iot.quasar.yandex.ru/m/user/scenarios/',
                body: send_data_str,
//                body: 'client_secret=' + y_alice.client_secret + '&client_id=' + y_alice.client_id + '&grant_type=' + 'password' + '&username=' + node.username + '&password=' + node.password,

                headers: {
                 'Content-type' : 'application/x-www-form-urlencoded',
                 'Ya-Consumer-Authorization' : 'OAuth ' + token,
                 'x-csrf-token' : csrf_token,
                 'Cookie' : cookies
                },
                resolveWithFullResponse: true,
                json: false // Automatically stringifies the body to JSON
              };

              await rp(options) ///// add scenario
              .then(function (body)
              {
//              var data = JSON.parse(body.body);
                if (is_debug) {Debug_Log("Add scenarios: ok");}
//                node.send(body);
//                scenarios_data = JSON.parse(body.body);
              })
              .catch(function (err)
              {
//                node.send(err);
                is_fail_scenario_add = true;
                if (is_debug) {Debug_Log("Add scenarios: fail " + err);}
                node.status({
                  fill: "red",
                  shape: "dot",
                  text: "Alice:scenarios:add:error:" + err
                });
              });
/////////////// ADD scenarios End //////////////
/////////////// GET Search SCENARIO Begin //////////////
        if (typeof(scenarios_data.scenarios) != "undefined" && scenarios_data.scenarios != null && !is_fail_scenario_add)
        {
          scenarios_data.scenarios.forEach(function(item, i, arr)
          {
//            node.send("scenarios " + i + " name is " + item.name);
            if (item.name.indexOf(scenario_name) > -1)
            {
//              node.send("found scenario is " + item.name);
              scenario_id = item.id;
              is_found_scenario = true;
            }
          });
        }
        else
        {
          node.send("scenario fail");
        }

           }
/////////////// GET ADD SCENARIO End //////////////

         }




////////////////////// NOW SEND COMMAND Begin ////////////////
            if (!is_fail_token && !is_fail_cookies && speaker_id.length > 0 && scenario_id.length > 0 && !is_fail_speaker && !is_fail_scenario)
            {
              if (is_debug) {Debug_Log("Execute command: begin");}

              var action = 'phrase';
              if (is_cmd)
              {
                action = 'text';
              }
              else
              {
                action = 'phrase';
              }

              var send_data = {};
              send_data.name = scenario_name;
              send_data.icon = new String('home');
              send_data.trigger_type = new String('scenario.trigger.voice');
              send_data.devices = new Array();
              send_data.external_actions = new Array();
              send_data.external_actions.push(new Object());
              send_data.external_actions[0].type = new String('scenario.external_action.' + action);
              send_data.external_actions[0].parameters = {};
              send_data.external_actions[0].parameters.current_device = new Boolean(false);
              send_data.external_actions[0].parameters.device_id = new String(speaker_id);
              if (is_cmd)
              {
                send_data.external_actions[0].parameters.text = new String(text);
              }
              else
              {
                send_data.external_actions[0].parameters.phrase = new String(text);
              }
              send_data_str = JSON.stringify(send_data);
//              node.send(send_data);
//              node.send("to send : " + send_data_str);

              var options =
              {
                method: 'PUT',
                uri: 'https://iot.quasar.yandex.ru/m/user/scenarios/' + scenario_id,
                body: send_data_str,
//                body: 'client_secret=' + y_alice.client_secret + '&client_id=' + y_alice.client_id + '&grant_type=' + 'password' + '&username=' + node.username + '&password=' + node.password,

                headers: {
                 'Content-type' : 'application/x-www-form-urlencoded',
                 'Ya-Consumer-Authorization' : 'OAuth ' + token,
                 'x-csrf-token' : csrf_token,
                 'Cookie' : cookies
                },
                resolveWithFullResponse: true,
                json: false // Automatically stringifies the body to JSON
              };

              await rp(options) ///// change scenario
              .then(function (body)
              {
//              var data = JSON.parse(body.body);
                if (is_debug) {Debug_Log("Execute command: update scenario: ok");}
//                node.send(body);
//                scenarios_data = JSON.parse(body.body);
              })
              .catch(function (err)
              {
//                node.send(err);
                is_fail_scenario_update = true;
                if (is_debug) {Debug_Log("Execute command: upadate scenario: fail " + err);}
                node.status({
                  fill: "red",
                  shape: "dot",
                  text: "Alice:scenarios:update:error:" + err
                });
              });

              var options =
              {
                method: 'POST',
                uri: 'https://iot.quasar.yandex.ru/m/user/scenarios/' + scenario_id + '/actions',
                body: send_data_str,
                headers: {
                 'Content-type' : 'application/x-www-form-urlencoded',
                 'Ya-Consumer-Authorization' : 'OAuth ' + token,
                 'x-csrf-token' : csrf_token,
                 'Cookie' : cookies
                },
                resolveWithFullResponse: true,
                json: false // Automatically stringifies the body to JSON
              };

              await rp(options) ///// change scenario
              .then(function (body)
              {
//              var data = JSON.parse(body.body);
                if (is_debug) {Debug_Log("Execute command: run scenario: ok");}
                node.status({
                    fill: "green",
                    shape: "dot",
                    text: "Alice:run:ok"
                });

//                node.send(body);
//                scenarios_data = JSON.parse(body.body);
              })
              .catch(function (err)
              {
//                node.send(err);
                is_fail_scenario_run = true;
                if (is_debug) {Debug_Log("Execute command: run scenario: fail " + err);}
                node.status({
                  fill: "red",
                  shape: "dot",
                  text: "Alice:scenarios:run:error:" + err
                });
              });
            }
////////////////////// NOW SEND COMMAND End ////////////////



///////////////// SEND DATA Begin ///////////

                if (!is_token_set || !is_cookies_set || !is_speaker_set || !is_scenario_set)
                {
                  if (!is_fail_token && !is_fail_cookies && !is_fail_scenario && !is_fail_speaker)
                  {
                    if (is_debug) {Debug_Log("Show all data: ok");}
                    msg.token = token;
                    msg.cookies = cookies;
                    msg.speaker_id = speaker_id;
                    msg.scenario_id = scenario_id;
                    msg.payload = '{"token":"' + token + '","cookies":"' + cookies + '"}';
                    node.send(msg);
                  }
                }
///////////////// SEND DATA End ///////////


     }////////////// end of acync






    make_action().then();

        }); //// end node

    }

    RED.nodes.registerType("alice-send", Y_Alice_Send);
}
