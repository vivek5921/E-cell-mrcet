import Admin from './Admin.js';
import About from './About.js';
import TeamMember from './TeamMember.js';
import Event from './Event.js';
import Gallery from './Gallery.js';
import Registration from './Registration.js';
import Message from './Message.js';
import Setting from './Setting.js';
import EurekaTeam from './EurekaTeam.js';
import EurekaParticipant from './EurekaParticipant.js';
import EurekaJudge from './EurekaJudge.js';
import EurekaScore from './EurekaScore.js';

// Setup associations
EurekaTeam.hasMany(EurekaParticipant, { as: 'members', foreignKey: 'team_id', onDelete: 'CASCADE' });
EurekaParticipant.belongsTo(EurekaTeam, { foreignKey: 'team_id' });

EurekaTeam.hasMany(EurekaScore, { as: 'scores', foreignKey: 'team_id', onDelete: 'CASCADE' });
EurekaScore.belongsTo(EurekaTeam, { foreignKey: 'team_id' });

EurekaJudge.hasMany(EurekaScore, { as: 'scores', foreignKey: 'judge_id', onDelete: 'CASCADE' });
EurekaScore.belongsTo(EurekaJudge, { foreignKey: 'judge_id' });

export {
  Admin,
  About,
  TeamMember,
  Event,
  Gallery,
  Registration,
  Message,
  Setting,
  EurekaTeam,
  EurekaParticipant,
  EurekaJudge,
  EurekaScore
};

