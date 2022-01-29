function saythanks() {
	confirmation = prompt("Indiquez votre prénom/pseudo pour accompagner le remerciement. \nMettez \"Anonyme\" si vous souhaitez le rester.");
	

	var request = new XMLHttpRequest();
	request.open("POST", "https://discord.com/api/webhooks/STUPID-SHITTY-PERSON/WHO-THINK-THEY-ARE-GOD-WHEN-THEY-SPAM-RANDOM-WEBHOOK");

	request.setRequestHeader('Content-type', 'application/json');

	var params = {
    	username: "ZELF - RIB Generator page",
    	avatar_url: "https://raw.githubusercontent.com/Poloin34/ZelfGenerateRib/master/favicon.png",
    	content: "**" + confirmation.toString() + "** te remercie !"
  	}

  	request.send(JSON.stringify(params));
}      
