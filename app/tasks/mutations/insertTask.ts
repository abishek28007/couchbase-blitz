import { sleep } from "app/core/sleep"
import couchdb from "db"

type InsertTaskInput = {
  label: string
}

export default async function insertTask(input: InsertTaskInput) {
  await sleep()
  await (await couchdb).bucket.collection("todo").upsert("testdoc", { name: input.label })
}
