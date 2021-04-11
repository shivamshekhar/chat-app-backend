const cryptUtils = require("../../lib").cryptUtils;
const userDbService = require('../db').user;
const relationDbService = require('../db').relation;

class Relation {
    static async fetchRelations(userName, relationType) {
        const decryptedUserName = cryptUtils.decryptString(userName);
        const userDetails = await userDbService.fetchUserDetailsByName(decryptedUserName);
        const userId = userDetails && userDetails.id;
        const relations = await relationDbService.getRelations(userId, relationType);
        const relatedUserIds = [];
        for(let r of relations) {
            if(!relatedUserIds.includes(r.uid1) && r.uid1 !== userId) {
                relatedUserIds.push(r.uid1);
            }

            if(!relatedUserIds.includes(r.uid2) && r.uid2 !== userId) {
                relatedUserIds.push(r.uid2);
            }
        }
        const relatedUserDetails = await userDbService.fetchManyUserDetailsById(relatedUserIds);

        relatedUserDetails.forEach(r => {
            r.name = cryptUtils.encryptString(r.name);
        });

        return relatedUserDetails;
    }
}

module.exports = Relation;
