module.exports.index = async (data, req, res) => {
  data.titleoverwrite = '🗣️ Discord Online Status'
  res.render('form', { data })
}

module.exports.settings = async (data, req, res) => {
  data.titleoverwrite = '🪛 Discord Online Status Settings'
  res.render('form', { data })
}
