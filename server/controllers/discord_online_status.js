module.exports.index = async (data, req, res) => {
  data.titleoverwrite = '🗣️ Discord Online Status'
  res.render('index', { data })
}

module.exports.settings = async (data, req, res) => {
  data.titleoverwrite = '🪛 Discord Online Status Settings'
  const FORM_INPUTS = {
    message_content: { type: 'text', placeholder: 'Message Content', extraClass: 'm_input' },
    message_color: { type: 'color', placeholder: 'Message Color', default: '#F29595' },
    author_name: { type: 'text', placeholder: 'Author Name', default: 'Discord Online Status' },
    author_icon_url: { type: 'link', placeholder: 'Author Icon URL' },
    title: { type: 'text', placeholder: 'Title' },
    description: { type: 'text', placeholder: 'Description' },
    link: { type: 'link', placeholder: 'Link', default: 'https://discord.gg/' },
    thumbnail_url: { type: 'link', placeholder: 'Thumbnail URL' },
    footer_text: {
      type: 'text',
      placeholder: 'Footer Text',
      disabled: true,
      default: 'Made with ❤️ by www.code-planet.eu'
    },
    footer_icon_url: { type: 'link', placeholder: 'Footer Icon URL', disabled: true, default: 'https://discord.gg/' }
  }
  const FORM_ROWS = [
    { message_content: FORM_INPUTS.message_content },
    { message_color: FORM_INPUTS.message_color },
    { author_name: FORM_INPUTS.author_name, author_icon_url: FORM_INPUTS.author_icon_url },
    { title: FORM_INPUTS.title, description: FORM_INPUTS.description, link: FORM_INPUTS.link },
    { thumbnail_url: FORM_INPUTS.thumbnail_url },
    { footer_text: FORM_INPUTS.footer_text, footer_icon_url: FORM_INPUTS.footer_icon_url }
  ]
  res.render('form', { data, FORM_ROWS })
}
