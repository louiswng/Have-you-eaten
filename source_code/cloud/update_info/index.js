// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
// 云函数入口函数
exports.main = async(event, context) => {

  const db = cloud.database();
  if (event.action == 'favor') {
    return await db.collection('c1_comment').where({ 'comment.content': event.content })
      .update({
        data: {
          'comment.$.favor':event.favor
        }
      }).then(res => {
        console.log("改变favor成功", res)
        return res
      })
      .catch(res => {
        console.log("改变favor失败", res)
        return res
      })
  } else if (event.action == 'comment'){
    return await db.collection('c1_comment').doc(event.id)
      .update({
        data: {
          comment: event.comment,
          rating:event.rating,
          price:event.price,
          num:event.num
        }
      }).then(res => {
        console.log("改变comment成功", res)
        return res
      })
      .catch(res => {
        console.log("改变comment失败", res)
        return res
      })
  }

}