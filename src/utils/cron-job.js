const cron = require("node-cron")
const {subDays, startOfDay, endOfDay} = require("date-fns")
const ConnectionRequestModel = require("../models/connectionRequest")
const sendMail = require("./sendMail")

const yesterday = subDays(new Date(), 1);
const yesterdayStart = startOfDay(yesterday);
const yesterdayEnd = endOfDay(yesterday);

cron.schedule(' 24 17 * * *', async () => {
    
    const connectionRequest =  await ConnectionRequestModel.find({
        status :"interested",
        createdAt: {
            $gt: yesterdayStart,
            $lt: yesterdayEnd
        }
    }).populate("fromUserId toUserId")
    
    const listOfEmails = [
        ...new Set(connectionRequest.map((req) => req.toUserId.emailId))
    ]

    listOfEmails.map(async (email) => {
        return await sendMail({
            to: "kartikey7518@gmail.com",
            subject: `new friend request pending for ${email}`,
            text: `hey checkout the connection requests on devTinder.`
        })
    })
})



