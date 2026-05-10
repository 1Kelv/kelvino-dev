// I render the full PDF health report for a baby using @react-pdf/renderer
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import {
  Baby,
  FeedEntry,
  NappyEntry,
  MedicationEntry,
  SymptomEntry,
  GrowthEntry,
  SleepEntry,
  AppointmentEntry,
} from '../../types';
import { formatDateTime, formatDate, formatDuration, babyAge } from '../../lib/utils';

interface BabyReportProps {
  baby: Baby;
  period: string; // e.g. "5 May – 11 May 2026"
  generatedOn: string; // e.g. "11 May 2026"
  feeds: FeedEntry[];
  nappies: NappyEntry[];
  medications: MedicationEntry[];
  symptoms: SymptomEntry[];
  growth: GrowthEntry[];
  sleep: SleepEntry[];
  appointments: AppointmentEntry[];
}

const C = {
  mint: '#4ECDC4',
  dark: '#2A9D8F',
  gray: '#6b7280',
  light: '#f0fdfa',
  border: '#e5e7eb',
};

const s = StyleSheet.create({
  page: { padding: 40, fontSize: 9, color: '#111827', fontFamily: 'Helvetica' },
  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: C.mint,
  },
  appName: { fontSize: 20, color: C.mint, fontFamily: 'Helvetica-Bold' },
  babyName: { fontSize: 14, fontFamily: 'Helvetica-Bold', marginTop: 4 },
  metaText: { fontSize: 9, color: C.gray, marginTop: 2 },
  // Sections
  section: { marginBottom: 18 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: C.mint,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: C.mint,
  },
  // Summary pills
  summaryRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  pill: { flex: 1, backgroundColor: C.light, borderRadius: 4, padding: 8 },
  pillValue: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: C.dark },
  pillLabel: { fontSize: 7.5, color: C.gray, marginTop: 1 },
  // Tables
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  th: { fontFamily: 'Helvetica-Bold', fontSize: 8, color: C.gray },
  td: { fontSize: 8.5 },
  noData: { fontSize: 8.5, color: C.gray, fontStyle: 'italic', marginTop: 4 },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 28,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 7.5,
    color: C.gray,
  },
  pageNum: { position: 'absolute', bottom: 28, right: 40, fontSize: 7.5, color: C.gray },
});

export function BabyReport({
  baby,
  period,
  generatedOn,
  feeds,
  nappies,
  medications,
  symptoms,
  growth,
  sleep,
  appointments,
}: BabyReportProps) {
  const totalMl = feeds.reduce((sum, e) => sum + e.amountMl, 0);
  const wetNappies = nappies.filter((e) => e.kind === 'wet' || e.kind === 'both').length;
  const dirtyNappies = nappies.filter((e) => e.kind === 'dirty' || e.kind === 'both').length;
  const totalSleepMins = sleep.reduce((sum, e) => sum + e.durationMins, 0);

  const behaviourLabel = (b?: string) =>
    b === 'active' ? 'Active' : b === 'drowsy' ? 'Drowsy' : b === 'asleep' ? 'Fell asleep' : '—';

  const skinLabel = (sk: string) =>
    sk === 'normal'
      ? 'Normal'
      : sk === 'pale'
        ? 'Pale'
        : sk === 'blue'
          ? 'Blue/Cyanotic'
          : sk === 'yellow'
            ? 'Yellow'
            : 'Mottled';

  return (
    <Document title={`Mylestone Report — ${baby.name}`} author="Mylestone">
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.headerRow}>
          <View>
            <Text style={s.appName}>Mylestone</Text>
            <Text style={s.babyName}>{baby.name}</Text>
            <Text style={s.metaText}>
              {babyAge(baby.dateOfBirth)}
              {baby.diagnosis ? ` · ${baby.diagnosis}` : ''}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[s.metaText, { fontFamily: 'Helvetica-Bold', color: '#111827' }]}>
              Health Report
            </Text>
            <Text style={s.metaText}>{period}</Text>
            <Text style={s.metaText}>Generated {generatedOn}</Text>
          </View>
        </View>

        {/* FEEDS */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Feeding</Text>
          <View style={s.summaryRow}>
            <View style={s.pill}>
              <Text style={s.pillValue}>{feeds.length}</Text>
              <Text style={s.pillLabel}>Total feeds</Text>
            </View>
            <View style={s.pill}>
              <Text style={s.pillValue}>{totalMl > 0 ? `${totalMl} ml` : '—'}</Text>
              <Text style={s.pillLabel}>Total volume</Text>
            </View>
            <View style={s.pill}>
              <Text style={s.pillValue}>
                {feeds.length > 0 && totalMl > 0
                  ? `${Math.round(totalMl / Math.max(1, Math.ceil(feeds.length / 6)))} ml`
                  : '—'}
              </Text>
              <Text style={s.pillLabel}>Avg per feed</Text>
            </View>
          </View>
          {feeds.length === 0 ? (
            <Text style={s.noData}>No feeds recorded in this period.</Text>
          ) : (
            <View>
              <View style={s.tableHeader}>
                <Text style={[s.th, { flex: 1.8 }]}>Date & Time</Text>
                <Text style={[s.th, { flex: 1 }]}>Type</Text>
                <Text style={[s.th, { flex: 0.8 }]}>Offered</Text>
                <Text style={[s.th, { flex: 0.8 }]}>Taken</Text>
                <Text style={[s.th, { flex: 0.8 }]}>Duration</Text>
                <Text style={[s.th, { flex: 1 }]}>Behaviour</Text>
              </View>
              {feeds.map((e, i) => (
                <View key={i} style={s.tableRow}>
                  <Text style={[s.td, { flex: 1.8 }]}>{formatDateTime(e.datetime)}</Text>
                  <Text style={[s.td, { flex: 1 }]}>
                    {e.type === 'formula'
                      ? 'Formula'
                      : e.type === 'breast_milk'
                        ? 'Breast Milk'
                        : 'Mixed'}
                  </Text>
                  <Text style={[s.td, { flex: 0.8 }]}>
                    {e.bottleAmountMl ? `${e.bottleAmountMl} ml` : '—'}
                  </Text>
                  <Text style={[s.td, { flex: 0.8 }]}>
                    {e.amountMl > 0 ? `${e.amountMl} ml` : '—'}
                  </Text>
                  <Text style={[s.td, { flex: 0.8 }]}>
                    {e.durationMins ? formatDuration(e.durationMins) : '—'}
                  </Text>
                  <Text style={[s.td, { flex: 1 }]}>{behaviourLabel(e.feedBehaviour)}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* NAPPIES */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Nappies</Text>
          <View style={s.summaryRow}>
            <View style={s.pill}>
              <Text style={s.pillValue}>{nappies.length}</Text>
              <Text style={s.pillLabel}>Total changes</Text>
            </View>
            <View style={s.pill}>
              <Text style={s.pillValue}>{wetNappies}</Text>
              <Text style={s.pillLabel}>Wet</Text>
            </View>
            <View style={s.pill}>
              <Text style={s.pillValue}>{dirtyNappies}</Text>
              <Text style={s.pillLabel}>Dirty</Text>
            </View>
          </View>
          {nappies.length === 0 ? (
            <Text style={s.noData}>No nappy changes recorded in this period.</Text>
          ) : (
            <View>
              <View style={s.tableHeader}>
                <Text style={[s.th, { flex: 2 }]}>Date & Time</Text>
                <Text style={[s.th, { flex: 1 }]}>Type</Text>
                <Text style={[s.th, { flex: 2 }]}>Notes</Text>
              </View>
              {nappies.map((e, i) => (
                <View key={i} style={s.tableRow}>
                  <Text style={[s.td, { flex: 2 }]}>{formatDateTime(e.datetime)}</Text>
                  <Text style={[s.td, { flex: 1 }]}>
                    {e.kind.charAt(0).toUpperCase() + e.kind.slice(1)}
                  </Text>
                  <Text style={[s.td, { flex: 2 }]}>{e.notes || '—'}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* MEDICATIONS */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Medications</Text>
          {medications.length === 0 ? (
            <Text style={s.noData}>No medications recorded in this period.</Text>
          ) : (
            <View>
              <View style={s.tableHeader}>
                <Text style={[s.th, { flex: 1.8 }]}>Date & Time</Text>
                <Text style={[s.th, { flex: 1.5 }]}>Medication</Text>
                <Text style={[s.th, { flex: 0.8 }]}>Dose</Text>
                <Text style={[s.th, { flex: 0.8 }]}>Route</Text>
                <Text style={[s.th, { flex: 1.2 }]}>Given by</Text>
              </View>
              {medications.map((e, i) => (
                <View key={i} style={s.tableRow}>
                  <Text style={[s.td, { flex: 1.8 }]}>{formatDateTime(e.datetime)}</Text>
                  <Text style={[s.td, { flex: 1.5 }]}>{e.medicationName}</Text>
                  <Text style={[s.td, { flex: 0.8 }]}>
                    {e.dose} {e.unit}
                  </Text>
                  <Text style={[s.td, { flex: 0.8 }]}>{e.route}</Text>
                  <Text style={[s.td, { flex: 1.2 }]}>{e.administeredBy}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* SYMPTOMS */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Symptoms & Observations</Text>
          {symptoms.length === 0 ? (
            <Text style={s.noData}>No observations recorded in this period.</Text>
          ) : (
            <View>
              <View style={s.tableHeader}>
                <Text style={[s.th, { flex: 1.8 }]}>Date & Time</Text>
                <Text style={[s.th, { flex: 1 }]}>Skin</Text>
                <Text style={[s.th, { flex: 1 }]}>Energy</Text>
                <Text style={[s.th, { flex: 1 }]}>Breathing</Text>
                <Text style={[s.th, { flex: 0.7 }]}>SpO2</Text>
                <Text style={[s.th, { flex: 0.7 }]}>Temp</Text>
              </View>
              {symptoms.map((e, i) => (
                <View key={i} style={s.tableRow}>
                  <Text style={[s.td, { flex: 1.8 }]}>{formatDateTime(e.datetime)}</Text>
                  <Text style={[s.td, { flex: 1 }]}>{skinLabel(e.skinColour)}</Text>
                  <Text style={[s.td, { flex: 1 }]}>{e.energyLevel.replace('_', ' ')}</Text>
                  <Text style={[s.td, { flex: 1 }]}>{e.breathing}</Text>
                  <Text style={[s.td, { flex: 0.7 }]}>
                    {e.spO2 != null ? `${e.spO2}%` : '—'}
                  </Text>
                  <Text style={[s.td, { flex: 0.7 }]}>
                    {e.temperatureC != null ? `${e.temperatureC}°C` : '—'}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* GROWTH */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Growth</Text>
          {growth.length === 0 ? (
            <Text style={s.noData}>No growth measurements in this period.</Text>
          ) : (
            <View>
              <View style={s.tableHeader}>
                <Text style={[s.th, { flex: 1.5 }]}>Date</Text>
                <Text style={[s.th, { flex: 1 }]}>Weight (kg)</Text>
                <Text style={[s.th, { flex: 1 }]}>Length (cm)</Text>
                <Text style={[s.th, { flex: 1.2 }]}>Head Circ. (cm)</Text>
                <Text style={[s.th, { flex: 1.5 }]}>Notes</Text>
              </View>
              {growth.map((e, i) => (
                <View key={i} style={s.tableRow}>
                  <Text style={[s.td, { flex: 1.5 }]}>{formatDate(e.date)}</Text>
                  <Text style={[s.td, { flex: 1 }]}>{e.weightKg} kg</Text>
                  <Text style={[s.td, { flex: 1 }]}>
                    {e.lengthCm != null ? `${e.lengthCm} cm` : '—'}
                  </Text>
                  <Text style={[s.td, { flex: 1.2 }]}>
                    {e.headCircumferenceCm != null ? `${e.headCircumferenceCm} cm` : '—'}
                  </Text>
                  <Text style={[s.td, { flex: 1.5 }]}>{e.notes || '—'}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* SLEEP */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Sleep</Text>
          <View style={s.summaryRow}>
            <View style={s.pill}>
              <Text style={s.pillValue}>{sleep.length}</Text>
              <Text style={s.pillLabel}>Sleep sessions</Text>
            </View>
            <View style={s.pill}>
              <Text style={s.pillValue}>
                {totalSleepMins > 0
                  ? formatDuration(Math.round(totalSleepMins / Math.max(sleep.length, 1)))
                  : '—'}
              </Text>
              <Text style={s.pillLabel}>Avg duration</Text>
            </View>
          </View>
          {sleep.length === 0 ? (
            <Text style={s.noData}>No sleep sessions recorded in this period.</Text>
          ) : (
            <View>
              <View style={s.tableHeader}>
                <Text style={[s.th, { flex: 1.5 }]}>Date</Text>
                <Text style={[s.th, { flex: 1 }]}>Duration</Text>
                <Text style={[s.th, { flex: 0.8 }]}>Wake-ups</Text>
                <Text style={[s.th, { flex: 0.8 }]}>Mood</Text>
                <Text style={[s.th, { flex: 2 }]}>Notes</Text>
              </View>
              {sleep.map((e, i) => (
                <View key={i} style={s.tableRow}>
                  <Text style={[s.td, { flex: 1.5 }]}>{formatDate(e.date)}</Text>
                  <Text style={[s.td, { flex: 1 }]}>{formatDuration(e.durationMins)}</Text>
                  <Text style={[s.td, { flex: 0.8 }]}>{e.wakeCount}</Text>
                  <Text style={[s.td, { flex: 0.8 }]}>{e.moodRating}/5</Text>
                  <Text style={[s.td, { flex: 2 }]}>{e.notes || '—'}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* APPOINTMENTS */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Appointments</Text>
          {appointments.length === 0 ? (
            <Text style={s.noData}>No appointments in this period.</Text>
          ) : (
            <View>
              <View style={s.tableHeader}>
                <Text style={[s.th, { flex: 1.8 }]}>Date & Time</Text>
                <Text style={[s.th, { flex: 1.5 }]}>Hospital</Text>
                <Text style={[s.th, { flex: 1.2 }]}>Department</Text>
                <Text style={[s.th, { flex: 1.2 }]}>Clinician</Text>
                <Text style={[s.th, { flex: 0.8 }]}>Status</Text>
              </View>
              {appointments.map((e, i) => (
                <View key={i} style={s.tableRow}>
                  <Text style={[s.td, { flex: 1.8 }]}>{formatDateTime(e.datetime)}</Text>
                  <Text style={[s.td, { flex: 1.5 }]}>{e.hospitalName}</Text>
                  <Text style={[s.td, { flex: 1.2 }]}>{e.department}</Text>
                  <Text style={[s.td, { flex: 1.2 }]}>{e.consultantName}</Text>
                  <Text style={[s.td, { flex: 0.8 }]}>
                    {e.status
                      ? e.status.charAt(0).toUpperCase() + e.status.slice(1)
                      : 'Upcoming'}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Footer */}
        <Text style={s.footer} fixed>
          Generated by Mylestone · mylestone-seven.vercel.app
        </Text>
        <Text
          style={s.pageNum}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
}
