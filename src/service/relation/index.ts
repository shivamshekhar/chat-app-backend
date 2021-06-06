import { CryptUtils } from "../../lib/cryptUtils";
import { db } from "../db";
const userDbService = db.user;
const relationDbService = db.relation;

export class Relation {
    static async fetchRelations(userName: string, relationType: string): Promise<any[]> {
        const decryptedUserName = CryptUtils.decryptString(userName);
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

        relatedUserDetails.forEach((r: any) => {
            r.name = CryptUtils.encryptString(r.name);
            r.password = undefined;
            r.created_at = undefined;
            r.updated_at = undefined;
        });

        return relatedUserDetails;
    }
}
