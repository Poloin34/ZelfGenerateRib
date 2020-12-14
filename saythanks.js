function saythanks() {
	confirmation = confirm("Ceci enverra UNIQUEMENT votre prénom au développeur de ce site web, êtes vous d'accord ?\nSi vous n'êtes pas d'accord, votre prénom sera remplacé par Anonyme");
	
	if (confirmation == true) {
		name = document.getElementById('name').value
		name = name.split(' ')
		name = name[0]

    } else {
    	name = "Anonyme"
    }

	var request = new XMLHttpRequest();
	request.open("POST", "https://discord.com/api/webhooks/788103456874692699/3KHQssqjmZBp6SGM5PN8w3U6G1qBwzJ33p-65fkwMj3DgD8TsCqY6r3d3Uvk3OylCIcU");

	request.setRequestHeader('Content-type', 'application/json');

	var params = {
    	username: "ZELF - RIB Generator page",
    	avatar_url: "https:///github.com/Poloin34/ZelfGenerateRib/favicon.png",
    	content: name.toString() + " te remercie !"
  	}

  	request.send(JSON.stringify(params));
}      