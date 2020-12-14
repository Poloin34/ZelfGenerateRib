function saythanks() {
	confirmation = prompt("Indiquez votre prénom/pseudo pour accompagner le remerciement. \nMettez \"Anonyme\" si vous souhaitez le rester.");
	

	var request = new XMLHttpRequest();
	request.open("POST", "https://discord.com/api/webhooks/788103456874692699/3KHQssqjmZBp6SGM5PN8w3U6G1qBwzJ33p-65fkwMj3DgD8TsCqY6r3d3Uvk3OylCIcU");

	request.setRequestHeader('Content-type', 'application/json');

	var params = {
    	username: "ZELF - RIB Generator page",
    	avatar_url: "https://raw.githubusercontent.com/Poloin34/ZelfGenerateRib/master/favicon.png",
    	content: "**" + confirmation.toString() + "** te remercie !"
  	}

  	request.send(JSON.stringify(params));
}      