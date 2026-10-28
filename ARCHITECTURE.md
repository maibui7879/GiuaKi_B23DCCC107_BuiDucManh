# Clean Code structure

```text
src/
├── core/                 # Cấu hình và thành phần dùng xuyên suốt app
│   ├── config/           # Environment, app config
│   ├── theme/            # Colors, spacing, typography
│   └── utils/            # Hàm tiện ích thuần
├── shared/               # UI/component dùng chung, không phụ thuộc feature
│   ├── components/
│   ├── hooks/
│   └── types/
└── features/             # Mỗi nghiệp vụ là một feature độc lập
    └── home/
        ├── data/         # API, DTO, repository implementation
        ├── domain/       # Entity, use case, repository contract
        └── presentation/ # Screen, component, hook của feature
```

Quy ước dependency: `core` không phụ thuộc `features`; `shared` không chứa
logic nghiệp vụ; code nghiệp vụ nằm trong `features`; screen chỉ điều phối
use case và component, không gọi API trực tiếp.
