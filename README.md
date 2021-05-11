Node-RED nodes for send command and tts to Yandex Alice

Nodes:
* alice-send Send voice command or text to speach to any Yandex.Alice speakers.

Examples:  
https://www.youtube.com/watch?v=kY6g7x9B-PU  
https://www.youtube.com/watch?v=ldF4b11SaiQ  
  
Installation:  
npm install node-red-contrib-yandex-alice-command  
  
  
Changes in version 1.05 14/06/20:  
* Added Alice icon  
* Added Debug option in login page  
* Added Status messages  
* Fixed Set node name  
  
Changes in version 1.07 15/06/20:  
* Fixed Get token with pasword that include special chars  
  
Changes in version 1.08 15/06/20:  
* Added Send to All speakers or to selected speaker  
  
Changes in version 1.10 16/06/20:  
* Added Send to selected speakers: speaker_id and speaker_name as list separated by sybmol ;   
  
Changes in version 1.12 16/06/20:  
* Added Separator sybmol ; or , or |   
  
  
Changes in version 1.14 19/06/20:  
* Changed Get cookies procedure, now not needed get token  
  
  
Changes in version 1.15 05/08/20:  
* Fixed for new Yandex Alice API  
  
  
Changes in version 1.17 27/11/20:  
* Fixed speaker not in room   
  
  
Changes in version 1.18 18/03/21:  
* Fixed for scenario new API   
  
  
Changes in version 1.19 11/05/21:  
* Fixed spec chars in password   
  
  
  
THNAKS TO:  
* https://github.com/AlexxIT/YandexStation  
* https://github.com/sergejey/majordomo-yadevices  
  
  
Если вам понравился проект - линк для благодарностей https://yasobe.ru/na/ya_alice_command  
  
  
<img src="http://wiki.swiitch.ru/images/3/3e/Node_red_yandex_alice.png">
<img src="http://wiki.swiitch.ru/images/d/d0/Node_red_yandex_alice_get_token.png">
<img src="http://wiki.swiitch.ru/images/c/c1/Node_red_yandex_alice_settings.png">
<img src="http://wiki.swiitch.ru/images/8/8c/Node_red_yandex_alice_login.png">
  
  
  
  
  
  
Альтернативный способ получения Cookies:
1. Зайти на https://yandex.ru/quasar/iot
2. Открыть панель разработчика
3. Найти запрос к странице и там взять отправленные cookies
<img src="http://wiki.swiitch.ru/images/6/66/Node_red_yandex_alice_get_cookies_alt.png">
  