const fs = require('fs');
const buffer = fs.readFileSync('alerts_detailed.json');
let content;
if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
    content = buffer.toString('utf16le');
} else if (buffer[0] === 0xFE && buffer[1] === 0xFF) {
    content = buffer.toString('utf16be');
} else {
    content = buffer.toString('utf8');
}
if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
}
const alerts = JSON.parse(content);

const criticalRules = ['node_nosqli_injection', 'js/sql-injection'];
const criticalAlerts = alerts.filter(a => criticalRules.includes(a.rule.id) && a.state === 'open');

const grouping = {};
criticalAlerts.forEach(a => {
    const file = a.most_recent_instance.location.path;
    if (!grouping[file]) grouping[file] = [];
    grouping[file].push({
        id: a.rule.id,
        line: a.most_recent_instance.location.start_line,
        message: a.most_recent_instance.message.text
    });
});

fs.writeFileSync('critical_alerts_summary.json', JSON.stringify(grouping, null, 2), 'utf8');
console.log("Summary generated: critical_alerts_summary.json");
