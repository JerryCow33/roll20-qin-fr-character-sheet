on("ready", function() {
    log("qinroll.js loaded !");
});

on('chat:message', function(msg) {
    if(msg.type != 'api' || msg.content.indexOf('!')) return;
    
    var arrayOfCommands = ["qinskill", "qinaspect", "qinattack", "qinmagic"];
    var chi;
    var characters = findObjs({
        _type: 'character',
        name: msg.who
    });
    var currentChar;
	var tabMsgContent = msg.content.substring(1).split(" ");
	var command = tabMsgContent[0];
	var tabArgs = tabMsgContent;
	tabArgs.shift();
	log("Commande : " + command);
	
	if(arrayOfCommands.indexOf(command) == -1)
	{
	    if(command === "power")
	    {
            log("Commande 'power' lancée via PowerCards.js !");
	    }
	    else
	    {
            log("ERREUR : mauvaise commande !");
	    }
	}
	else
	{
        if(characters.length == 0)
        {
            log("ERREUR : problème de personnage !");
        }
        else
        {
            currentChar = characters[0];
            log("Character found : " + currentChar.get("name"));
            chi = findObjs({                              
                name: "chi",
                characterid: currentChar.get("_id"),
                _type: "attribute"
            })[0]; 
        } 
	}
	
	switch(command){
		case "qinskill":
			if(tabArgs.length > 0)
			{
			    var arg = tabArgs.join(" ");
			    if(arg != "")
			    {
			        var tabAspectSkill = arg.split("|");
			        if(tabAspectSkill.length == 5)
			        {
			            var aspectName = tabAspectSkill[0];
			            var aspectLvl = parseInt(tabAspectSkill[1], 10);
			            var skillName = tabAspectSkill[2];
			            var skillLvl = parseInt(tabAspectSkill[3], 10);
			            var bonus = parseInt(tabAspectSkill[4], 10);
			            var messSkill = "";
			            if(skillLvl == 0)
			            {
			                messSkill = " - 3 ";
			            }
			            else
			            {
			                messSkill = " + " + skillLvl;
			            }
        				sendChat("System", "[[1d10]] [[1d10]]", function(fmsg) {
        				    var resultMessage = "";
        				    var totalYin = parseInt(fmsg[0].inlinerolls["0"].results.total - 1, 10);
        				    var totalYang = parseInt(fmsg[0].inlinerolls["1"].results.total - 1, 10);
        				    var tabAspectColor = {
        				        "Bois" : "#a06a0a",
        				        "Feu": "#c81b1d",
        				        "Terre": "#0a8d0d",
        				        "Eau": "#2a65bf",
        				        "Métal": "#a49898"
        				    };
        				    
                            resultMessage += "!power";
                            resultMessage += " {{";
                            resultMessage += " --bgcolor|" + tabAspectColor[aspectName];
                            resultMessage += " --name|Test de compétence";
                            resultMessage += " --leftsub|" + skillName;
                            resultMessage += " --rightsub|" + aspectName;
                            resultMessage += " --Niveau d'Aspect:|[! " + aspectLvl + " !]";
                            resultMessage += " --Niveau de compétence:|[! " + skillLvl + " !]";
                            resultMessage += " --Bonus:|[! " + bonus + " !]";
                            resultMessage += " --Yin:|[! " + totalYin + " !]";
                            resultMessage += " --Yang:|[! " + totalYang + " !]";
                            if(totalYin == totalYang)
                            {
                                var newChiVal = 0;
                                if(totalYin == 0)
                                {
                                    if(currentChar)
                                    {
                                        newChiVal = chi.get("current") - 5;
                                        if(newChiVal < 0)
                                        {
                                            newChiVal = 0;
                                        }
                                        chi.set("current", newChiVal);
                                    }
                                    resultMessage += " --Résultat|Echec critique - Vous échouez lamentablement et perdez 5 points de Chi.";
                                }
                                else
                                {
                                    if(currentChar)
                                    {
                                        newChiVal = chi.get("current") + totalYin;
                                        if(newChiVal > chi.get("max"))
                                        {
                                            newChiVal = chi.get("max");
                                        }
                                        chi.set("current", newChiVal);
                                    }
                                    resultMessage += " --Résultat|Succès critique - Votre Yin et votre Yang sont en équilibre ! Vous regagnez " + totalYin + " points de Chi.";
                                }
                            }
                            else
                            {
                                if(skillLvl == 0)
                                {
                                    skillLvl = -3;
                                }
                                var messageYinYang = "";
                                var result = Math.abs(totalYin - totalYang) + aspectLvl + skillLvl + bonus;
                                if(totalYin > totalYang)
                                {
                                    messageYinYang = "Votre Yin est dominant.";
                                }
                                else
                                {
                                    messageYinYang = "Votre Yang est dominant.";
                                }
                                resultMessage += " --Résultat:|abs(" + totalYin + " - " + totalYang + ") + " + aspectLvl + messSkill + " + " + bonus + " = [! " + result + " !] : " + messageYinYang;
                            }
                            resultMessage += " }}";

        				    sendChat("System", resultMessage);
        				});
			        }
			        else
			        {
			            sendChat("System", "ERREUR : le ou les arguments sont invalides !");
			        }
			    }
			    else
			    {
			        sendChat("System", "ERREUR : vous n'avez pas fourni d'arguments pour le lancer !");
			    }
			}
			else
			{
				sendChat("System", "ERREUR : vous n'avez pas fourni d'arguments pour le lancer !");
			}
			break;
		case "qinmagic":
			if(tabArgs.length > 0)
			{
			    var arg = tabArgs.join(" ");
			    if(arg != "")
			    {
			        var tabAspectSkill = arg.split("|");
			        if(tabAspectSkill.length == 6)
			        {
			            var aspectName = tabAspectSkill[0];
			            var aspectLvl = parseInt(tabAspectSkill[1], 10);
			            var skillName = tabAspectSkill[2];
			            var skillLvl = parseInt(tabAspectSkill[3], 10);
			            var bonus = parseInt(tabAspectSkill[4], 10);
			            var magicName = tabAspectSkill[5];
			            var messSkill = "";
			            if(skillLvl == 0)
			            {
			                messSkill = " - 3 ";
			            }
			            else
			            {
			                messSkill = " + " + skillLvl;
			            }
        				sendChat("System", "[[1d10]] [[1d10]]", function(fmsg) {
        				    var resultMessage = "";
        				    var totalYin = parseInt(fmsg[0].inlinerolls["0"].results.total - 1, 10);
        				    var totalYang = parseInt(fmsg[0].inlinerolls["1"].results.total - 1, 10);
        				    var tabAspectColor = {
        				        "Bois" : "#a06a0a",
        				        "Feu": "#c81b1d",
        				        "Terre": "#0a8d0d",
        				        "Eau": "#2a65bf",
        				        "Métal": "#a49898"
        				    };
        				    
                            resultMessage += "!power";
                            resultMessage += " {{";
                            resultMessage += " --bgcolor|" + tabAspectColor[aspectName];
                            resultMessage += " --name|Test de magie";
                            resultMessage += " --leftsub|" + magicName;
                            resultMessage += " --rightsub|" + skillName;
                            resultMessage += " --Niveau de " + aspectName + ":|[! " + aspectLvl + " !]";
                            resultMessage += " --Niveau de " + skillName + ":|[! " + skillLvl + " !]";
                            resultMessage += " --Bonus:|[! " + bonus + " !]";
                            resultMessage += " --Yin:|[! " + totalYin + " !]";
                            resultMessage += " --Yang:|[! " + totalYang + " !]";
                            if(totalYin == totalYang)
                            {
                                var newChiVal = 0;
                                if(totalYin == 0)
                                {
                                    if(currentChar)
                                    {
                                        newChiVal = chi.get("current") - 5;
                                        if(newChiVal < 0)
                                        {
                                            newChiVal = 0;
                                        }
                                        chi.set("current", newChiVal);
                                    }
                                    resultMessage += " --Résultat|Echec critique - Vous échouez lamentablement et perdez 5 points de Chi.";
                                }
                                else
                                {
                                    if(currentChar)
                                    {
                                        newChiVal = chi.get("current") + totalYin;
                                        if(newChiVal > chi.get("max"))
                                        {
                                            newChiVal = chi.get("max");
                                        }
                                        chi.set("current", newChiVal);
                                    }
                                    resultMessage += " --Résultat|Succès critique - Votre Yin et votre Yang sont en équilibre ! Vous regagnez " + totalYin + " points de Chi.";
                                }
                            }
                            else
                            {
                                if(skillLvl == 0)
                                {
                                    skillLvl = -3;
                                }
                                var messageYinYang = "";
                                var result = Math.abs(totalYin - totalYang) + aspectLvl + skillLvl + bonus;
                                if(totalYin > totalYang)
                                {
                                    messageYinYang = "Votre Yin est dominant.";
                                }
                                else
                                {
                                    messageYinYang = "Votre Yang est dominant.";
                                }
                                resultMessage += " --Résultat:|abs(" + totalYin + " - " + totalYang + ") + " + aspectLvl + messSkill + " + " + bonus + " = [! " + result + " !] : " + messageYinYang;
                            }
                            resultMessage += " }}";

        				    sendChat("System", resultMessage);
        				});
			        }
			        else
			        {
			            sendChat("System", "ERREUR : le ou les arguments sont invalides !");
			        }
			    }
			    else
			    {
			        sendChat("System", "ERREUR : vous n'avez pas fourni d'arguments pour le lancer !");
			    }
			}
			else
			{
				sendChat("System", "ERREUR : vous n'avez pas fourni d'arguments pour le lancer !");
			}
			break;
		case "qinaspect":
			if(tabArgs.length > 0)
			{
			    var arg = tabArgs.join(" ");
			    if(arg != "")
			    {
			        var tabAspectSkill = arg.split("|");
			        if(tabAspectSkill.length == 3)
			        {
			            var aspectName = tabAspectSkill[0];
			            var aspectLvl = parseInt(tabAspectSkill[1], 10);
			            var bonus = parseInt(tabAspectSkill[2], 10);
			            
        				sendChat("System", "[[1d10]] [[1d10]]", function(fmsg) {
        				    var resultMessage = "";
        				    var totalYin = parseInt(fmsg[0].inlinerolls["0"].results.total - 1, 10);
        				    var totalYang = parseInt(fmsg[0].inlinerolls["1"].results.total - 1, 10);
        				    var tabAspectColor = {
        				        "Bois" : "#a06a0a",
        				        "Feu": "#c81b1d",
        				        "Terre": "#0a8d0d",
        				        "Eau": "#2a65bf",
        				        "Métal": "#a49898"
        				    };
        				    
                            resultMessage += "!power";
                            resultMessage += " {{";
                            resultMessage += " --bgcolor|" + tabAspectColor[aspectName];
                            resultMessage += " --name|Test d'Aspect";
                            resultMessage += " --leftsub|" + aspectName;
                            resultMessage += " --Niveau d'Aspect:|[! " + aspectLvl + " !]";
                            resultMessage += " --Bonus:|[! " + bonus + " !]";
                            resultMessage += " --Yin:|[! " + totalYin + " !]";
                            resultMessage += " --Yang:|[! " + totalYang + " !]";
                            if(totalYin == totalYang)
                            {
                                var newChiVal = 0;
                                if(totalYin == 0)
                                {
                                    if(currentChar)
                                    {
                                        newChiVal = chi.get("current") - 5;
                                        if(newChiVal < 0)
                                        {
                                            newChiVal = 0;
                                        }
                                        chi.set("current", newChiVal);
                                    }
                                    resultMessage += " --Résultat:|Echec critique - Vous échouez lamentablement et perdez 5 points de Chi.";
                                }
                                else
                                {
                                    if(currentChar)
                                    {
                                        newChiVal = chi.get("current") + totalYin;
                                        if(newChiVal > chi.get("max"))
                                        {
                                            newChiVal = chi.get("max");
                                        }
                                        chi.set("current", newChiVal);
                                    }
                                    resultMessage += " --Résultat:|Succès critique - Votre Yin et votre Yang sont en équilibre ! Vous regagnez " + totalYin + " points de Chi.";
                                }
                            }
                            else
                            {
                                var messageYinYang = "";
                                var result = Math.abs(totalYin - totalYang) + aspectLvl + bonus;
                                if(totalYin > totalYang)
                                {
                                    messageYinYang = "Votre Yin est dominant.";
                                }
                                else
                                {
                                    messageYinYang = "Votre Yang est dominant.";
                                }
                                resultMessage += " --Résultat:|abs(" + totalYin + " - " + totalYang + ") + " + aspectLvl + " + " + bonus + " = [! " + result + " !] : " + messageYinYang;
                            }
                            resultMessage += " }}";

        				    sendChat("System", resultMessage);
        				});
			        }
			        else
			        {
			            sendChat("System", "ERREUR : le ou les arguments sont invalides !");
			        }
			    }
			    else
			    {
			        sendChat("System", "ERREUR : vous n'avez pas fourni d'arguments pour le lancer !");
			    }
			}
			else
			{
				sendChat("System", "ERREUR : vous n'avez pas fourni d'arguments pour le lancer !");
			}
			break;
		case "qinattack":
			if(tabArgs.length > 0)
			{
			    var arg = tabArgs.join(" ");
			    if(arg != "")
			    {
			        var tabAspectSkill = arg.split("|");
			        if(tabAspectSkill.length == 7)
			        {
			            var aspectName = tabAspectSkill[0];
			            var aspectLvl = parseInt(tabAspectSkill[1], 10);
			            var skillName = tabAspectSkill[2];
			            var skillLvl = parseInt(tabAspectSkill[3], 10);
			            var bonus = parseInt(tabAspectSkill[4], 10);
			            var weaponName = tabAspectSkill[5];
			            var weaponDgt = parseInt(tabAspectSkill[6], 10);
			            var messSkill = "";
			            if(skillLvl == 0)
			            {
			                messSkill = " - 3 ";
			            }
			            else
			            {
			                messSkill = " + " + skillLvl;
			            }
        				sendChat("System", "[[1d10]] [[1d10]]", function(fmsg) {
        				    var resultMessage = "";
        				    var totalYin = parseInt(fmsg[0].inlinerolls["0"].results.total - 1, 10);
        				    var totalYang = parseInt(fmsg[0].inlinerolls["1"].results.total - 1, 10);
        				    var tabAspectColor = {
        				        "Bois" : "#a06a0a",
        				        "Feu": "#c81b1d",
        				        "Terre": "#0a8d0d",
        				        "Eau": "#2a65bf",
        				        "Métal": "#a49898"
        				    };
        				    
                            resultMessage += "!power";
                            resultMessage += " {{";
                            resultMessage += " --bgcolor|" + tabAspectColor[aspectName];
                            resultMessage += " --name|Test d'Attaque";
                            resultMessage += " --leftsub|Arme";
                            resultMessage += " --rightsub|" + weaponName;
                            resultMessage += " --Dégâts de l'arme:|[! " + weaponDgt + " !]";
							resultMessage += " --Niveau de Métal:|[! " + aspectLvl + " !]";
                            resultMessage += " --Niveau de " + skillName + ":|[! " + skillLvl + " !]";
                            resultMessage += " --Bonus:|[! " + bonus + " !]";
                            resultMessage += " --Yin:|[! " + totalYin + " !]";
                            resultMessage += " --Yang:|[! " + totalYang + " !]";
                            if(totalYin == totalYang)
                            {
                                var newChiVal = 0;
                                if(totalYin == 0)
                                {
                                    if(currentChar)
                                    {
                                        newChiVal = chi.get("current") - 5;
                                        if(newChiVal < 0)
                                        {
                                            newChiVal = 0;
                                        }
                                        chi.set("current", newChiVal);
                                    }
                                    resultMessage += " --Résultat|Echec critique - Vous échouez lamentablement et perdez 5 points de Chi.";
                                }
                                else
                                {
                                    if(currentChar)
                                    {
                                        newChiVal = chi.get("current") + totalYin;
                                        if(newChiVal > chi.get("max"))
                                        {
                                            newChiVal = chi.get("max");
                                        }
                                        chi.set("current", newChiVal);
                                    }
                                    resultMessage += " --Résultat|Succès critique - Votre Yin et votre Yang sont en équilibre ! Vous regagnez " + totalYin + " points de Chi.";
									var degats = totalYin + aspectLvl + weaponDgt;
									resultMessage += " --Dégâts:|" + totalYin + " + " + aspectLvl + " + " + weaponDgt + " = [! " + degats + " !] points de dégâts infligés.";
                                }
                            }
                            else
                            {
                                if(skillLvl == 0)
                                {
                                    skillLvl = -3;
                                }
                                var messageYinYang = "";
                                var messageDegats = "";
                                var result = Math.abs(totalYin - totalYang) + aspectLvl + skillLvl + bonus;
								var degats = 0;
                                if(totalYin > totalYang)
                                {
									degats = aspectLvl + weaponDgt;
                                    messageYinYang = "Votre Yin est dominant.";
									messageDegats = aspectLvl + " + " + weaponDgt + " = [! " + degats + " !]";
                                }
                                else
                                {
									degats = Math.abs(totalYin - totalYang) + aspectLvl + weaponDgt;
                                    messageYinYang = "Votre Yang est dominant.";
									messageDegats = "abs(" + totalYin + " - " + totalYang + ") + " + aspectLvl + " + " + weaponDgt + " = [! " + degats + " !]";
                                }
                                resultMessage += " --Résultat:|abs(" + totalYin + " - " + totalYang + ") + " + aspectLvl + messSkill + " + " + bonus + " = [! " + result + " !] : " + messageYinYang;
								resultMessage += " --Dégâts:|" + messageDegats + " points de dégâts infligés.";
                            }
                            resultMessage += " }}";

        				    sendChat("System", resultMessage);
        				});
			        }
			        else
			        {
			            sendChat("System", "ERREUR : le ou les arguments sont invalides !");
			        }
			    }
			    else
			    {
			        sendChat("System", "ERREUR : vous n'avez pas fourni d'arguments pour le lancer !");
			    }
			}
			else
			{
				sendChat("System", "ERREUR : vous n'avez pas fourni d'arguments pour le lancer !");
			}
			break;
	}
});
