// const mockjs = require('mockjs');

module.exports = {
  // 'PROXY /api/demo': 'http://127.0.0.1:3000',
  'GET /api/demo': (req, res) => (
    res.json({
      errno: 0,
      errmsg: '操作成功!',
      data: {
        id: 1,
        msg: 'success',
      },
    })
  ),
};
