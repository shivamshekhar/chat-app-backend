import { User } from "./user";
import { Relation } from "./relation";
import { Base } from "./base";

const dbObj = new Base();
const userObj = new User(dbObj);
const relationObj = new Relation(dbObj);

export const db = {
  init: dbObj.init.bind(dbObj),
  user: userObj,
  relation: relationObj,
};

// (async function() {
//     const db = require('../db');
//     await db.init();
//     const response = await db.relation.getRelations(7, 'blocked');
//     console.log(response);
//     process.exit(0);
// }())
