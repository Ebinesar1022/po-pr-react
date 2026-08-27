import { useState } from 'react';
import type { MouseEvent } from 'react';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PRESETS, resolvePreset, formatRangeLabel } from '../dateRange';
import type { DateRangeValue, PresetKey } from '../dateRange';

function toInputValue(d: Date | null): string {
  if (!d) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function fromInputValue(v: string): Date | null {
  if (!v) return null;
  const [y, m, d] = v.split('-').map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? null : date;
}

export default function DateRangeFilter({
  value,
  onChange
}: {
  value: DateRangeValue;
  onChange: (range: DateRangeValue) => void;
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [customStart, setCustomStart] = useState(toInputValue(value.start));
  const [customEnd, setCustomEnd] = useState(toInputValue(value.end));

  const open = Boolean(anchorEl);

  const pillSx = {
    color: '#fff',
    borderColor: 'rgba(255,255,255,0.35)',
    bgcolor: 'rgba(255,255,255,0.06)',
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 600,
    px: 2,
    '&:hover': { borderColor: 'rgba(255,255,255,0.6)', bgcolor: 'rgba(255,255,255,0.12)' }
  };

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setCustomStart(toInputValue(value.start));
    setCustomEnd(toInputValue(value.end));
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const applyPreset = (key: PresetKey) => {
    onChange(resolvePreset(key));
    handleClose();
  };

  const applyCustom = () => {
    const start = fromInputValue(customStart);
    const end = fromInputValue(customEnd);
    if (!start || !end) return;
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    onChange(start.getTime() > end.getTime() ? { start: end, end: start } : { start, end });
    handleClose();
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<CalendarTodayIcon fontSize="small" />}
        endIcon={<ExpandMoreIcon />}
        onClick={handleOpen}
        sx={pillSx}
      >
        {formatRangeLabel(value)}
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { borderRadius: 2, mt: 1 } }}
      >
        <Box sx={{ display: 'flex', minWidth: 440 }}>
          <List dense sx={{ width: 190, py: 1, borderRight: '1px solid', borderColor: 'divider' }}>
            {PRESETS.map((preset) => (
              <ListItemButton key={preset.key} onClick={() => applyPreset(preset.key)}>
                <ListItemText primary={preset.label} />
              </ListItemButton>
            ))}
          </List>
          <Box sx={{ p: 2.5, flex: 1 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
              Custom Range
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="From"
                type="date"
                size="small"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="To"
                type="date"
                size="small"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2.5 }}>
              <Button onClick={handleClose}>Cancel</Button>
              <Button variant="contained" disabled={!customStart || !customEnd} onClick={applyCustom}>
                Apply
              </Button>
            </Box>
          </Box>
        </Box>
      </Popover>
    </>
  );
}
