# SFM Page-Based Code Migration Guide for MAIN APP Files

## New SFM Code Structure for MAIN APP Files

Each page now has its own SFM flow with dedicated code ranges:

- **Free Calculator & Affordability**: `SFM-0XX-X` series
- **APF Pages & Sub Pages**: `SFM-APF-1XXX-X` series  
- **Profile Page**: `SFM-PRF-2XXX-X` series
- **Net Asset Value**: `SFM-NAV-3XXX-X` series
- **Calculators Page**: `SFM-CAL-4XXX-X` series
- **Payments Page**: `SFM-PAY-5XXX-X` series
- **Reports Page**: `SFM-REP-6XXX-X` series
- **Statements Page**: `SFM-STA-7XXX-X` series
- **FREE Benefits Page**: `SFM-BEN-8XXX-X` series

## Suffix Conventions

- **-X**: Sponsorship Year/Tranche (1-9, F for final)
- **-C**: Contributions
- **-V**: Fund Value  
- **-G**: Growth
- **-F**: Final expected sponsorship year

## Migration Mapping

### Old → New Code Mappings

#### Free Calculator (SFM-0XX-X)