module.exports.index = async (data, req, res) => {
  data.titleoverwrite = '🗣️ Discord Online Status'
  res.render('index', { data })
}

module.exports.settings = async (data, req, res) => {
  data.titleoverwrite = '🪛 Discord Embed Settings'
  const FORM_INPUTS = {
    message_content: {
      type: 'text',
      placeholder: 'Message Content',
      extraClass: 'm_input',
      required: true,
      default: 'Hi @everyone'
    },
    message_color: { type: 'color', placeholder: 'Message Color', default: '#F29595' },
    author_name: {
      type: 'text',
      placeholder: 'Author Name',
      required: true,
      default: '{user_name} is now live on Twitch!'
    },
    author_icon_url: { type: 'link', placeholder: 'Author Icon URL', required: true, default: '{user_avatar_url}' },
    title: { type: 'text', placeholder: 'Title', required: true, default: '{title}' },
    description: { type: 'text', placeholder: 'Description', required: true, default: 'Playing {game}' },
    link: { type: 'link', placeholder: 'Link', default: 'https://twitch.tv/{user_name}' },
    thumbnail_url: {
      type: 'link',
      placeholder: 'Thumbnail URL',
      default: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_{user_name}-1920x1080.jpg'
    },
    footer_text: {
      type: 'text',
      placeholder: 'Footer Text',
      disabled: true,
      default: 'Made with ❤️ by www.code-planet.eu - {time}'
    },
    footer_icon_url: {
      type: 'link',
      placeholder: 'Footer Icon URL',
      disabled: true,
      default: 'https://code-planet.eu/images/Logo.png'
    }
  }
  const FORM_ROWS = [
    { message_content: FORM_INPUTS.message_content },
    { message_color: FORM_INPUTS.message_color },
    { author_name: FORM_INPUTS.author_name, author_icon_url: FORM_INPUTS.author_icon_url },
    { title: FORM_INPUTS.title, description: FORM_INPUTS.description, link: FORM_INPUTS.link },
    { thumbnail_url: FORM_INPUTS.thumbnail_url },
    { footer_text: FORM_INPUTS.footer_text, footer_icon_url: FORM_INPUTS.footer_icon_url }
  ]
  const LEGEND_ROWS = [
    { '{user_name}': 'Twitch Username.' },
    { '{user_avatar_url}': 'Twitch Avatar URL.' },
    { '{title}': 'Twitch Title.' },
    { '{game}': 'Twitch Game.' },
    { '{time}': 'Current Time.' }
  ]
  if (req.method === 'GET') res.render('settings', { data, FORM_ROWS, LEGEND_ROWS })
  else if (req.method === 'POST') {
    res.render('settings', { data, FORM_ROWS, LEGEND_ROWS })
  }
}
