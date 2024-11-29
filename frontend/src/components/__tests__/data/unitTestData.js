const tools = {
    data: [
        {
            type: 'type2',
            code: 'Code1',
            brand: 'Brand A',
        },
        {
            type: 'type1',
            code: 'Code2',
            brand: 'Brand B',
        },
        {
            type: 'type3',
            code: 'Code3',
            brand: 'Brand C',
        },
        {
            type: 'type3',
            code: 'Code4',
            brand: 'Brand D',
        },
    ],
};

const toolCharges = {
    data: [
        {
            type: 'type1',
            dailyCharge: 1.99,
            chargeOnWeekday: true,
            chargeOnWeekend: true,
            chargeOnHoliday: false,
        },
        {
            type: 'type2',
            dailyCharge: 1.49,
            chargeOnWeekday: true,
            chargeOnWeekend: false,
            chargeOnHoliday: true,
        },
        {
            type: 'type3',
            dailyCharge: 2.99,
            chargeOnWeekday: true,
            chargeOnWeekend: false,
            chargeOnHoliday: false,
        },
    ],
};

export { tools, toolCharges };
