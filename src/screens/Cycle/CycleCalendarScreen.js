import React, { useCallback, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, type, spacing, radii } from '../../theme/theme';
import { Card, Eyebrow, Button } from '../../components/UI';
import MoonPhase from '../../components/MoonPhase';
import cycleApi from '../../api/cycleApi';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function CycleCalendarScreen({ navigation }) {
  const [monthDate, setMonthDate] = useState(new Date());
  const [cycles, setCycles] = useState([]);
  const [summary, setSummary] = useState(null);

  const load = useCallback(async () => {
    try {
      const [listRes, summaryRes] = await Promise.all([
        cycleApi.getCycles({ limit: 12 }),
        cycleApi.getCycleSummary(),
      ]);

      setCycles(listRes.data.cycles || []);
      setSummary(summaryRes.data);
    } catch (error) {
      console.log('Cycle load error:', error.response?.data || error.message);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const periodDates = new Set();

  cycles.forEach((cycle) => {
    datesBetween(cycle.startDate, cycle.endDate).forEach((d) =>
      periodDates.add(d)
    );
  });

  const days = daysInMonthGrid(monthDate);

  return (
    <ScrollView contentContainerStyle={styles.body}>
      <Eyebrow>Cycle calendar</Eyebrow>

      <Text style={[type.h1, { marginTop: 6, marginBottom: spacing.lg }]}>
        Your cycle history
      </Text>

      <Card style={styles.summaryCard}>
        <MoonPhase
          progress={
            summary
              ? summary.currentCycleDay / (summary.avgCycleLength || 28)
              : 0.5
          }
          size={64}
        />

        <View style={{ marginLeft: spacing.md, flex: 1 }}>
          <Text style={type.h2}>
            Cycle Day {summary?.currentCycleDay ?? '--'}
          </Text>

          <Text style={type.bodyMuted}>
            Avg. cycle {summary?.avgCycleLength ?? '--'} days · Avg. period{' '}
            {summary?.avgPeriodLength ?? '--'} days
          </Text>
        </View>
      </Card>

      <Card style={{ marginTop: spacing.md }}>
        <View style={styles.monthHeader}>
          <Pressable onPress={() => setMonthDate(addMonths(monthDate, -1))}>
            <Text style={styles.monthNav}>‹</Text>
          </Pressable>

          <Text style={type.h2}>
            {monthDate.toLocaleString('default', {
              month: 'long',
              year: 'numeric',
            })}
          </Text>

          <Pressable onPress={() => setMonthDate(addMonths(monthDate, 1))}>
            <Text style={styles.monthNav}>›</Text>
          </Pressable>
        </View>

        <View style={styles.weekRow}>
          {WEEKDAYS.map((day, i) => (
            <Text key={i} style={styles.weekday}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.grid}>
          {days.map((day, i) => {
            if (!day) {
              return <View key={i} style={styles.cell} />;
            }

            const dateKey = isoDate(day);
            const isPeriod = periodDates.has(dateKey);
            const isToday = dateKey === isoDate(new Date());

            return (
              <View key={i} style={styles.cell}>
                <View
                  style={[
                    styles.dayCircle,
                    isPeriod && styles.dayPeriod,
                    isToday && styles.dayToday,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isPeriod && { color: colors.white },
                    ]}
                  >
                    {day.getDate()}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: colors.blushDeep },
              ]}
            />
            <Text style={type.caption}>Period</Text>
          </View>

          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                {
                  borderWidth: 1.5,
                  borderColor: colors.lavenderDeep,
                  backgroundColor: 'transparent',
                },
              ]}
            />
            <Text style={type.caption}>Today</Text>
          </View>
        </View>
      </Card>

      <Button
        title="Log a period"
        onPress={() => navigation.navigate('LogPeriod')}
        style={{ marginTop: spacing.lg }}
      />
    </ScrollView>
  );
}

function daysInMonthGrid(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  const first = new Date(year, month, 1);
  const offset = first.getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const cells = Array(offset).fill(null);

  for (let d = 1; d <= totalDays; d++) {
    cells.push(new Date(year, month, d, 12));
  }

  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}

function addMonths(date, amount) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + amount);
  return d;
}

function isoDate(date) {
  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function datesBetween(start, end) {
  if (!start) return [];

  const result = [];

  const current = new Date(start);
  const last = end ? new Date(end) : new Date(start);

  current.setHours(12, 0, 0, 0);
  last.setHours(12, 0, 0, 0);

  while (current <= last) {
    result.push(isoDate(current));
    current.setDate(current.getDate() + 1);
  }

  return result;
}

const styles = StyleSheet.create({
  body: {
    padding: spacing.lg,
    backgroundColor: colors.moonlight,
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 60,
  },

  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  monthNav: {
    fontSize: 22,
    color: colors.lavenderDeep,
    paddingHorizontal: 10,
  },

  weekRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },

  weekday: {
    flex: 1,
    textAlign: 'center',
    ...type.caption,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },

  cell: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    paddingVertical: 4,
  },

  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dayPeriod: {
    backgroundColor: colors.blushDeep,
  },

  dayToday: {
    borderWidth: 1.5,
    borderColor: colors.lavenderDeep,
  },

  dayText: {
    fontFamily: type.body.fontFamily,
    fontSize: 14,
    color: colors.ink,
  },

  legendRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
});