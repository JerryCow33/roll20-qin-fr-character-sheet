on("ready", function() {
    log("qinroll.js loaded !");
});

on('chat:message', function(msg) {
    if(msg.type != 'api' || msg.content.indexOf('!')) return;
    
    var chi;
    var chiMax;
    var characters = findObjs({_type: 'character'});
    var currentChar;
    characters.forEach(function(chr) {
        if(chr.get('name') == msg.who)
        {
            currentChar = chr;
        }
    });
 
    if(currentChar)
    {
        var chi = findObjs({                              
            name: "chi",
            characterid: currentChar.get("_id"),
            _type: "attribute"
        })[0]; 
        //log(JSON.stringify(chi, null, "  "));
        log(chi.get("name") + " , " + chi.get("current") + " / " + chi.get("max"));
        log("== CHARACTER ==\nName : " + currentChar.get('name') + "\nActual Chi : " + chi.get("current") + "\nChi max : " + chi.get("max"));
        //return;
    }
    else
    {
        log("ERREUR : problème de personnage !");
    }
    
	var tabMsgContent = msg.content.substring(1).split(" ");
	var command = tabMsgContent[0];
	var tabArgs = tabMsgContent;
	tabArgs.shift();
	log("Commande : " + command);
	switch(command){
		case "skill":
			if(tabArgs.length > 0)
			{
			    var arg = tabArgs.join(" ");
			    if(arg != "")
			    {
			        log(arg);
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
        				    var totalYin = parseInt(fmsg[0].inlinerolls["0"].results.total, 10);
        				    var totalYang = parseInt(fmsg[0].inlinerolls["1"].results.total, 10);
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
                                if(totalYin == 1)
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
                                    resultMessage += " --Résultat|Echec critique - Vous échouez lamentablement et perdez 5 points de Chi."
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
                                    resultMessage += " --Résultat|Succès critique - Votre Yin et votre Yang sont en équilibre ! Vous regagnez " + totalYin + " points de Chi."
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
		case "aspect":
			if(tabArgs.length > 0)
			{
			    var arg = tabArgs.join(" ");
			    if(arg != "")
			    {
			        log(arg);
			        var tabAspectSkill = arg.split("|");
			        if(tabAspectSkill.length == 3)
			        {
			            var aspectName = tabAspectSkill[0];
			            var aspectLvl = parseInt(tabAspectSkill[1], 10);
			            var bonus = parseInt(tabAspectSkill[2], 10);
			            
        				sendChat("System", "[[1d10]] [[1d10]]", function(fmsg) {
        				    var resultMessage = "";
        				    var totalYin = parseInt(fmsg[0].inlinerolls["0"].results.total, 10);
        				    var totalYang = parseInt(fmsg[0].inlinerolls["1"].results.total, 10);
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
                                if(totalYin == 1)
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
                                    resultMessage += " --Résultat|Echec critique - Vous échouez lamentablement et perdez 5 points de Chi."
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
                                    resultMessage += " --Résultat|Succès critique - Votre Yin et votre Yang sont en équilibre ! Vous regagnez " + totalYin + " points de Chi."
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
		case "combat":
			// some code here
			break;
	}
});
