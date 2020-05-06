'use strict'

const fs = require('fs'),
	path = require('path'),
	readline = require('readline')

const configDir = path.join(__dirname, '../settings'),
	configFile = path.join(configDir, '_tera-client_.json'),
	servers = require('./cli/servers.json')

let config = {
		autoUpdate: true,
    	autoUpdateMods: true,
    	accountEmail: "",
    	accountPassword: "",
    	region: "",
    	serverName: "",
    	characterName: ""
}

try {
	config = Object.assign(config, JSON.parse(fs.readFileSync(configFile)))
}
catch(e) {
	if(!fs.existsSync(configDir)) fs.mkdirSync(configDir)
}

function currentServer() {
    for (let server of servers) {
        if (server.name.toLowerCase()===config.serverName) return servers.indexOf(server)+1
	}
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
function question(q) { return new Promise(resolve => { rl.question(q, resolve) }) }

(async () => {
	config.region = await parseRegion( await question(`Region (${config.region==='na'? 'NA/eu/ru' : config.region==='eu'? 'na/EU/ru': config.region==='ru'? 'na/eu/RU': 'na/eu/ru'}):`), config.region)
	config.autoUpdate = config.autoUpdateMods = parseBool(await question(`Automatically update client? (${config.autoUpdate ? 'Y/n' : 'y/N'}): `),
		config.autoUpdate)

	if(config.autoUpdate){
		config.autoUpdateMods = parseBool(await question(`Automatically update mods? (${config.autoUpdateMods ? 'Y/n' : 'y/N'}): `),
			config.autoUpdateMods)
	}
	config.accountEmail = keepDefault( await question(`Account Email (${config.accountEmail}): `), config.accountEmail)
	config.accountPassword = keepDefault( await question(`Account Password: `), config.accountPassword)
	config.serverName = parseServer( await question(`${servers.map((s, i)=>`\n${i+1}) ${s.name}`)}\nServer(${currentServer()}):`))
	config.characterName = keepDefault( await question(`Character Name (${config.characterName}): `), config.characterName)

	fs.writeFileSync(configFile, JSON.stringify(config, null, '\t'))
	rl.close()
})()

function parseBool(str, def) {
	if(!str) return def
	return ['y', 'yes', 'true', '1'].includes(str.toLowerCase())
}

function parseServer(i) {
	if(!i)i = currentServer()
	try {
		return servers[i-1].name.toLowerCase()
	}
	catch(e){
		console.error(`Invalid Server!`)
		process.exit(1)
	}
}

function parseRegion(str, def) {
	if(!str) return def
	str = str.toLowerCase()
	switch(str){
		case "na": return str
		case "eu": return str
		case "ru": return str
		default: 
			console.error('Unsupported region! (Valid Regions: "NA", "EU", "RU"')
			process.exit(1)
	}
}

function keepDefault(str, def) {
	if(!str) return def
	return str
}