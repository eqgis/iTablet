const scan = require('./icon_scan.png')
const scan_circle = require('./scan_circle.png')
const scan_line = require('./scan_line.png')
const scan_net = require('./scan_net.png')
const ar_scan = require('./img-icon-ar_scan.png')
const ar_przt = require('./img-icon-ar_presentation.png')
const ar_infra = require('./img-icon-ar_infrastructure.png')
const ar_dr_supermap = require('./ar_dr_supermap.png')
const ar_3d_map = require('./ar_3d_map.png')
const ar_flat_map = require('./ar_flat_map.png')
const ar_supermap_building = require('./ar_supermap_building.png')
const background_red = require('./background_red.png')
const background_transparent = require('./background_transparent.png')
const scan_circle_red = require('./scan_circle_red.png')
const scan_line_red = require('./scan_line_red.png')
const scan_net_red = require('./scan_inner_red.png')
const icon_return = require('./icon_other_return.png')
const guide_arrow = require('./icon_exhibition_guide.png')
const icon_cover = require('./location_on.png')
const icon_window = require('./window.png')
const icon_tool_rectangle = require('./icon_tool_rectangle.png')
const icon_tool_fix = require('./icon_tool_fix.png')
const icon_tool_radius = require('./icon_tool_radius.png')
const icon_tool_depth = require('./icon_tool_depth.png')
const icon_cancel = require('./icon_cancel.png')
const icon_tool_distance = require('./icon_tool_distance.png')
const icon_tool_length = require('./icon_tool_length.png')
const icon_tool_slider = require('./icon_tool_slider.png')
const icon_speak_selected = require('./icon_speak_selected.png')
const icon_speak = require('./icon_speak.png')
const icon_action_selected = require('./icon_action_selected.png')
const icon_action = require('./icon_action.png')
const icon_reloader_selected = require('./icon_reloader_selected.png')
const icon_reloader = require('./icon_reloader.png')
const icon_photo_seleted = require('./icon_photo_seleted.png')
const icon_photo = require('./icon_photo.png')
const icon_video = require('./icon_video.png')
const icon_video_selected = require('./icon_video_selected.png')

const icon_doctor = require('./icon_doctor.png')
const icon_doctor_selected = require('./icon_doctor_selected.png')
const icon_superman = require('./icon_superman.png')
const icon_superman_selected = require('./icon_superman_selected.png')

const tool_advertise_selected = require('./tool_advertise_selected.png')
const tool_advertise = require('./tool_advertise.png')
const tool_attribute_selected = require('./tool_attribute_selected.png')
const tool_attribute = require('./tool_attribute.png')
const tool_lighting_selected = require('./tool_lighting_selected.png')
const tool_lighting = require('./tool_lighting.png')
const tool_location_selected = require('./tool_location_selected.png')
const tool_location = require('./tool_location.png')
const tool_sectioning_selected = require('./tool_sectioning_selected.png')
const tool_sectioning = require('./tool_sectioning.png')
const icon_close = require('./icon_close.png')
const icon_other_scan = require('./icon_other_scan.png')
const icon_save_local = require('./icon_save_local.png')
const icon_cancel02 = require('./icon_cancel02.png')
const bg_01 = require('./bg_01.png')
const bg_02 = require('./bg_02.png')
const icon_tool_reset = require('./icon_tool_reset.png')

const icon_action_follow_me = require('./icon_action_follow_me.png')
const icon_action_greet = require('./icon_action_greet.png')
const icon_action_handshake = require('./icon_action_handshake.png')
const icon_action_please = require('./icon_action_please.png')
const icon_action_risus = require('./icon_action_risus.png')
const icon_action_speak = require('./icon_action_speak.png')
const icon_action_stand_by = require('./icon_action_stand_by.png')
const icon_action_turn_around = require('./icon_action_turn_around.png')
const icon_action_walk = require('./icon_action_walk.png')
const logo_supermap = require('./logo-supermap.png')

const image = {
  scan,
  scan_circle,
  scan_line,
  scan_net,
  ar_scan,
  ar_przt,
  ar_infra,
  background_red,
  background_transparent,
  scan_circle_red,
  scan_line_red,
  scan_net_red,
  icon_return,
  guide_arrow,
  icon_cover,
  icon_window,
  icon_tool_rectangle,
  ar_dr_supermap,
  ar_3d_map,
  ar_flat_map,
  ar_supermap_building,

  tool_advertise_selected,
  tool_advertise,
  tool_attribute_selected,
  tool_attribute,
  tool_lighting_selected,
  tool_lighting,
  tool_location_selected,
  tool_location,
  tool_sectioning_selected,
  tool_sectioning,

  icon_close,
  icon_other_scan,
  icon_tool_fix,
  icon_tool_radius,
  icon_tool_depth,
  icon_cancel,
  bg_01,
  bg_02,
  icon_tool_reset,
  icon_tool_distance,
  icon_tool_length,
  icon_tool_slider,
  icon_speak_selected,
  icon_speak,
  icon_action_selected,
  icon_action,
  icon_reloader_selected,
  icon_reloader,
  icon_photo_seleted,
  icon_photo,
  icon_video_selected,
  icon_video,
  icon_doctor_selected,
  icon_doctor,
  icon_superman_selected,
  icon_superman,
  icon_save_local,
  icon_cancel02,

  icon_action_follow_me,
  icon_action_greet,
  icon_action_handshake,
  icon_action_please,
  icon_action_risus,
  icon_action_speak,
  icon_action_stand_by,
  icon_action_turn_around,
  icon_action_walk,
  logo_supermap,
}

function getImage(): typeof image {
  return image
}

export {
  getImage
}