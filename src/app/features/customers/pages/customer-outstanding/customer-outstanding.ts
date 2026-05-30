import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  ViewChild,
  computed,
  signal,
} from '@angular/core';
import * as d3 from 'd3';

type Customer = {
  name: string;
  city: string;
  district: string;
  count: number;
  outstanding: number;
};

type DistrictGroup = {
  key: string;
  label: string;
  customers: Customer[];
  total: number;
  count: number;
};

type MapFeature = d3.GeoPermissibleObjects & {
  properties: {
    NAME_2?: string;
  };
};

type TooltipState = {
  visible: boolean;
  x: number;
  y: number;
  districtName: string;
  customers: Customer[];
  total: number;
};

const CUSTOMERS: Customer[] = [
  { name: 'Raj Textiles', city: 'Chennai', district: 'Chennai', count: 12, outstanding: 7250000 },
  { name: 'Global Impex', city: 'Chennai', district: 'Chennai', count: 9, outstanding: 5100000 },
  { name: 'Surya Electronics', city: 'Chennai', district: 'Chennai', count: 7, outstanding: 3800000 },
  { name: 'Marina Traders', city: 'Chennai', district: 'Chennai', count: 5, outstanding: 2200000 },
  {
    name: 'Kavitha Stores',
    city: 'Coimbatore',
    district: 'Coimbatore',
    count: 8,
    outstanding: 4320000,
  },
  {
    name: 'PSG Agencies',
    city: 'Coimbatore',
    district: 'Coimbatore',
    count: 6,
    outstanding: 3100000,
  },
  {
    name: 'Kavi Spinning Mills',
    city: 'Coimbatore',
    district: 'Coimbatore',
    count: 10,
    outstanding: 6500000,
  },
  { name: 'Senthil Traders', city: 'Madurai', district: 'Madurai', count: 6, outstanding: 2100000 },
  {
    name: 'Meenakshi Wholesale',
    city: 'Madurai',
    district: 'Madurai',
    count: 4,
    outstanding: 1650000,
  },
  { name: 'Pandian Fabrics', city: 'Madurai', district: 'Madurai', count: 5, outstanding: 2900000 },
  {
    name: 'Priya Enterprises',
    city: 'Trichy',
    district: 'Tiruchirappalli',
    count: 9,
    outstanding: 5680000,
  },
  {
    name: 'Rock Fort Traders',
    city: 'Trichy',
    district: 'Tiruchirappalli',
    count: 6,
    outstanding: 3200000,
  },
  { name: 'Arun & Co.', city: 'Salem', district: 'Salem', count: 5, outstanding: 1850000 },
  {
    name: 'Steel City Supplies',
    city: 'Salem',
    district: 'Salem',
    count: 7,
    outstanding: 3400000,
  },
  {
    name: 'Sakthi Distributors',
    city: 'Salem',
    district: 'Salem',
    count: 4,
    outstanding: 1200000,
  },
  {
    name: 'Meena Distributors',
    city: 'Tirunelveli',
    district: 'Tirunelveli',
    count: 7,
    outstanding: 3400000,
  },
  {
    name: 'Nellai Agencies',
    city: 'Tirunelveli',
    district: 'Tirunelveli',
    count: 4,
    outstanding: 1800000,
  },
  { name: 'Kumar Industries', city: 'Vellore', district: 'Vellore', count: 4, outstanding: 980000 },
  { name: 'Arcot Leathers', city: 'Vellore', district: 'Vellore', count: 3, outstanding: 750000 },
  { name: 'Lakshmi Agencies', city: 'Erode', district: 'Erode', count: 6, outstanding: 2750000 },
  { name: 'Bhavani Textiles', city: 'Erode', district: 'Erode', count: 8, outstanding: 4100000 },
  {
    name: 'Balaji Wholesale',
    city: 'Dindigul',
    district: 'Dindigul',
    count: 3,
    outstanding: 640000,
  },
  {
    name: 'Sirumalai Traders',
    city: 'Dindigul',
    district: 'Dindigul',
    count: 2,
    outstanding: 480000,
  },
  {
    name: 'Sri Murugan Co.',
    city: 'Thoothukudi',
    district: 'Thoothukudi',
    count: 5,
    outstanding: 1920000,
  },
  {
    name: 'Port City Impex',
    city: 'Thoothukudi',
    district: 'Thoothukudi',
    count: 4,
    outstanding: 1550000,
  },
  { name: 'Anbu Traders', city: 'Tiruppur', district: 'Tiruppur', count: 11, outstanding: 6100000 },
  { name: 'KPR Garments', city: 'Tiruppur', district: 'Tiruppur', count: 9, outstanding: 5400000 },
  {
    name: 'Tiruppur Knitwear',
    city: 'Tiruppur',
    district: 'Tiruppur',
    count: 7,
    outstanding: 3900000,
  },
  {
    name: 'Vijay Enterprises',
    city: 'Thanjavur',
    district: 'Thanjavur',
    count: 4,
    outstanding: 1450000,
  },
  {
    name: 'Cauvery Agencies',
    city: 'Thanjavur',
    district: 'Thanjavur',
    count: 3,
    outstanding: 980000,
  },
  {
    name: 'Nithya Supplies',
    city: 'Kanchipuram',
    district: 'Kanchipuram',
    count: 3,
    outstanding: 720000,
  },
  {
    name: 'Silk Route Traders',
    city: 'Kanchipuram',
    district: 'Kanchipuram',
    count: 5,
    outstanding: 1900000,
  },
  {
    name: 'Selvam & Sons',
    city: 'Nagapattinam',
    district: 'Nagapattinam',
    count: 2,
    outstanding: 430000,
  },
  { name: 'Durai Textiles', city: 'Namakkal', district: 'Namakkal', count: 4, outstanding: 890000 },
  {
    name: 'Namakkal Lorry Works',
    city: 'Namakkal',
    district: 'Namakkal',
    count: 6,
    outstanding: 2200000,
  },
  {
    name: 'VNR Fireworks Co.',
    city: 'Virudhunagar',
    district: 'Virudhunagar',
    count: 5,
    outstanding: 2100000,
  },
  {
    name: 'Sivakasi Print House',
    city: 'Virudhunagar',
    district: 'Virudhunagar',
    count: 4,
    outstanding: 1700000,
  },
  {
    name: 'Hosur Auto Parts',
    city: 'Krishnagiri',
    district: 'Krishnagiri',
    count: 6,
    outstanding: 2900000,
  },
  {
    name: 'Denso Suppliers',
    city: 'Krishnagiri',
    district: 'Krishnagiri',
    count: 5,
    outstanding: 2300000,
  },
];

const DISTRICT_ALIASES: Record<string, string> = {
  tiruchirappalli: 'tiruchirappalli',
  trichinopoly: 'tiruchirappalli',
  trichy: 'tiruchirappalli',
  tiruppur: 'tiruppur',
  tirupur: 'tiruppur',
  thoothukudi: 'thoothukudi',
  tuticorin: 'thoothukudi',
  kanyakumari: 'kanyakumari',
  kanniyakumari: 'kanyakumari',
  tirunelveli: 'tirunelveli',
  tinnevelly: 'tirunelveli',
  'the nilgiris': 'the nilgiris',
  nilgiris: 'the nilgiris',
  villupuram: 'villupuram',
  viluppuram: 'villupuram',
  virudhunagar: 'virudhunagar',
  krishnagiri: 'krishnagiri',
  cuddalore: 'cuddalore',
  nagapattinam: 'nagapattinam',
  thanjavur: 'thanjavur',
  tiruvarur: 'tiruvarur',
  pudukkottai: 'pudukkottai',
  sivaganga: 'sivaganga',
  ramanathapuram: 'ramanathapuram',
  theni: 'theni',
  dindigul: 'dindigul',
  karur: 'karur',
  perambalur: 'perambalur',
  ariyalur: 'ariyalur',
  namakkal: 'namakkal',
  salem: 'salem',
  erode: 'erode',
  coimbatore: 'coimbatore',
  dharmapuri: 'dharmapuri',
  kanchipuram: 'kanchipuram',
  tiruvallur: 'tiruvallur',
  chennai: 'chennai',
  chengalpattu: 'chengalpattu',
  madurai: 'madurai',
  ranipet: 'ranipet',
  tirupattur: 'tirupattur',
  tenkasi: 'tenkasi',
  kallakurichi: 'kallakurichi',
  vellore: 'vellore',
  tiruvannamalai: 'tiruvannamalai',
};

@Component({
  selector: 'app-customer-outstanding',
  standalone: true,
  imports: [],
  templateUrl: './customer-outstanding.html',
  styleUrl: './customer-outstanding.css',
})
export class CustomerOutstanding implements AfterViewInit {
  @ViewChild('mapSvg') private readonly mapSvg?: ElementRef<SVGSVGElement>;
  @ViewChild('mapWrap') private readonly mapWrap?: ElementRef<HTMLElement>;

  protected readonly search = signal('');
  protected readonly selectedDistrict = signal<string | null>(null);
  protected readonly mapStatus = signal<'loading' | 'ready' | 'error'>('loading');
  protected readonly tooltip = signal<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    districtName: '',
    customers: [],
    total: 0,
  });

  protected readonly districtGroups = this.buildDistrictGroups();
  protected readonly totalInvoices = CUSTOMERS.reduce((sum, customer) => sum + customer.count, 0);
  protected readonly totalOutstanding = CUSTOMERS.reduce(
    (sum, customer) => sum + customer.outstanding,
    0,
  );

  protected readonly filteredGroups = computed(() => {
    const query = this.search().trim().toLowerCase();
    const selectedKey = this.selectedDistrict();
    const sourceGroups = selectedKey
      ? this.districtGroups.filter((group) => group.key === selectedKey)
      : this.districtGroups;

    return sourceGroups
      .map((group) => {
        const customers = query
          ? group.customers.filter((customer) => this.matchesCustomerSearch(customer, group, query))
          : group.customers;

        return {
          ...group,
          customers,
          visibleTotal: customers.reduce((sum, customer) => sum + customer.outstanding, 0),
        };
      })
      .filter((group) => group.customers.length > 0);
  });

  protected readonly selectedGroup = computed(() => {
    const key = this.selectedDistrict();
    return key ? (this.filteredGroups().find((group) => group.key === key) ?? this.findDistrict(key)) : null;
  });

  protected readonly filteredTotalInvoices = computed(() =>
    this.filteredGroups().reduce(
      (sum, group) =>
        sum + group.customers.reduce((groupSum, customer) => groupSum + customer.count, 0),
      0,
    ),
  );

  protected readonly filteredTotalOutstanding = computed(() =>
    this.filteredGroups().reduce((sum, group) => sum + group.visibleTotal, 0),
  );

  constructor(private readonly ngZone: NgZone) {}

  ngAfterViewInit(): void {
    void this.renderMap();
  }

  protected fmt(value: number): string {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    }

    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }

    return `₹${value.toLocaleString('en-IN')}`;
  }

  protected updateSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  protected selectDistrict(key: string): void {
    this.selectedDistrict.set(key);
    this.highlightDistrict(key);
    this.showDistrictSummary(key);
  }

  protected clearSelection(): void {
    this.selectedDistrict.set(null);
    this.tooltip.update((state) => ({ ...state, visible: false }));
    this.highlightDistrict(null);
  }

  private async renderMap(): Promise<void> {
    if (!this.mapSvg) {
      this.mapStatus.set('error');
      return;
    }

    try {
      const response = await fetch(
        'https://cdn.jsdelivr.net/gh/tarunshah/India-D3@master/TamilNadu.geojson',
      );
      const geojson = (await response.json()) as GeoJSON.FeatureCollection;
      const features = geojson.features as MapFeature[];
      const svg = d3.select(this.mapSvg.nativeElement);
      const projection = d3.geoMercator().fitSize([500, 700], geojson);
      const path = d3.geoPath().projection(projection);

      svg.selectAll('*').remove();

      svg
        .selectAll<SVGPathElement, MapFeature>('path')
        .data(features)
        .join('path')
        .attr('class', 'district-path')
        .attr('d', path)
        .attr('fill', (feature) => {
          const key = this.resolveDistrict(feature.properties.NAME_2);
          const group = this.findDistrict(key);
          return this.colorByAmount(group?.total ?? 0);
        })
        .on('mousemove', (event: MouseEvent, feature) => {
          this.ngZone.run(() => this.showTooltip(event, feature));
        })
        .on('mouseleave', () => {
          this.ngZone.run(() => {
            this.tooltip.update((state) => ({ ...state, visible: false }));
          });
        })
        .on('click', (_event: MouseEvent, feature) => {
          this.ngZone.run(() => {
            const key = this.resolveDistrict(feature.properties.NAME_2);
            this.selectDistrict(key);
          });
        });

      this.mapStatus.set('ready');
    } catch {
      this.mapStatus.set('error');
    }
  }

  private showTooltip(event: MouseEvent, feature: MapFeature): void {
    const key = this.resolveDistrict(feature.properties.NAME_2);
    const group = this.findDistrict(key);
    const wrap = this.mapWrap?.nativeElement;

    if (!wrap) {
      return;
    }

    const rect = wrap.getBoundingClientRect();
    let x = event.clientX - rect.left + 14;
    let y = event.clientY - rect.top - 8;

    if (x + 240 > wrap.offsetWidth) {
      x = event.clientX - rect.left - 240;
    }

    if (y < 8) {
      y = 8;
    }

    this.tooltip.set({
      visible: true,
      x,
      y,
      districtName: group?.label ?? feature.properties.NAME_2 ?? 'District',
      customers: group?.customers ?? [],
      total: group?.total ?? 0,
    });
  }

  private showDistrictSummary(key: string): void {
    const group = this.findDistrict(key);

    if (!group) {
      return;
    }

    this.tooltip.update((state) => ({
      ...state,
      districtName: group.label,
      customers: group.customers,
      total: group.total,
    }));
  }

  private highlightDistrict(key: string | null): void {
    if (!this.mapSvg) {
      return;
    }

    d3.select(this.mapSvg.nativeElement)
      .selectAll<SVGPathElement, MapFeature>('.district-path')
      .classed('highlighted', (feature) => this.resolveDistrict(feature.properties.NAME_2) === key);
  }

  private colorByAmount(amount: number): string {
    if (!amount) {
      return '#E6F1FB';
    }

    if (amount < 1000000) {
      return '#B5D4F4';
    }

    if (amount < 3000000) {
      return '#85B7EB';
    }

    if (amount < 6000000) {
      return '#378ADD';
    }

    if (amount < 10000000) {
      return '#185FA5';
    }

    return '#0C447C';
  }

  private resolveDistrict(value?: string): string {
    const normalized = (value ?? '').toLowerCase().trim();
    return DISTRICT_ALIASES[normalized] ?? normalized;
  }

  private findDistrict(key: string): DistrictGroup | undefined {
    return this.districtGroups.find((group) => group.key === key);
  }

  private matchesCustomerSearch(customer: Customer, group: DistrictGroup, query: string): boolean {
    return (
      customer.name.toLowerCase().includes(query) ||
      customer.city.toLowerCase().includes(query) ||
      group.label.toLowerCase().includes(query) ||
      group.key.includes(query)
    );
  }

  private buildDistrictGroups(): DistrictGroup[] {
    const grouped = new Map<string, DistrictGroup>();

    for (const customer of CUSTOMERS) {
      const key = this.resolveDistrict(customer.district);
      const existing = grouped.get(key);

      if (existing) {
        existing.customers.push(customer);
        existing.total += customer.outstanding;
        existing.count += customer.count;
      } else {
        grouped.set(key, {
          key,
          label: customer.district,
          customers: [customer],
          total: customer.outstanding,
          count: customer.count,
        });
      }
    }

    return [...grouped.values()].sort((a, b) => b.total - a.total);
  }
}
