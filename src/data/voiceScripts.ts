// 목소리 녹음을 위한 대사집
// 최소 30초 이상 자연스럽게 읽을 수 있는 일상적인 대사들

export interface VoiceScript {
    id: string;
    title: string;
    content: string;
    estimatedSeconds: number;
}

// 자녀용 대사집
export const childScripts: VoiceScript[] = [
    {
        id: 'child_1',
        title: '일상 대화',
        content: `엄마, 오늘 날씨가 정말 좋네요. 산책 다녀오셨어요? 저도 오늘 회사에서 일찍 끝나서 집에 왔어요. 
        밥은 드셨나요? 건강 챙기시는 거 잊지 마세요. 이번 주말에 시간 되시면 같이 영화 보러 가요. 
        요즘 몸은 어떠세요? 무리하지 마시고 꾸준히 운동하시는 거 잊지 마세요. 
        저도 요즘 바빠서 자주 못 뵈었는데, 앞으로 더 자주 연락 드릴게요. 
        엄마가 항상 걱정해주시는 것처럼 저도 엄마 건강 걱정하고 있어요.`,
        estimatedSeconds: 45
    },
    {
        id: 'child_2',
        title: '안부 인사',
        content: `안녕하세요, 엄마. 저예요. 오늘 하루는 어떠셨어요? 
        저는 오늘 회사에서 프로젝트를 잘 마무리했어요. 엄마 덕분에 열심히 할 수 있었어요. 
        요즘 날씨가 추워지는데 감기 조심하세요. 따뜻하게 입으시고, 물도 자주 드세요. 
        약은 시간 맞춰서 드시고, 식사도 꼭 챙겨 드세요. 
        엄마가 건강하시면 저도 마음이 편해요. 이번 주말에 시간 되시면 전화 드릴게요. 
        항상 건강하시고, 행복하세요. 사랑해요, 엄마.`,
        estimatedSeconds: 50
    },
    {
        id: 'child_3',
        title: '가족 이야기',
        content: `엄마, 오늘 저녁에 뭐 드셨어요? 맛있게 드셨나요? 
        저는 오늘 친구들과 저녁을 먹었는데, 엄마가 해주시던 된장찌개가 생각났어요. 
        엄마 요리는 정말 최고예요. 언제 한번 또 배워야겠어요. 
        요즘 어떻게 지내시는지 궁금해요. 혼자 계시면 외로우실 수도 있겠지만, 
        저희가 항상 엄마 생각하고 있다는 거 잊지 마세요. 
        이번 달 말에 시간 되시면 집에 가서 같이 시간 보내요. 
        그때까지 건강하게 지내세요.`,
        estimatedSeconds: 48
    },
    {
        id: 'child_4',
        title: '건강 챙기기',
        content: `엄마, 오늘도 건강하시죠? 요즘 몸 컨디션은 어떠세요? 
        저는 엄마 건강이 제일 걱정이에요. 꾸준히 병원 다니시고, 
        약도 시간 맞춰서 드시는 거 잊지 마세요. 
        운동도 가볍게라도 하시고, 물도 하루에 충분히 드세요. 
        식사도 제때 챙겨 드시고, 과일도 자주 드세요. 
        엄마가 건강하시면 저도 마음이 편해요. 
        항상 건강 챙기시고, 무리하지 마세요. 사랑해요.`,
        estimatedSeconds: 42
    }
];

// 부모용 대사집
export const parentScripts: VoiceScript[] = [
    {
        id: 'parent_1',
        title: '일상 대화',
        content: `안녕, 우리 아들. 오늘 하루는 어땠니? 엄마는 오늘 아침에 일찍 일어나서 
        산책을 다녀왔어. 날씨가 좋아서 기분도 좋았단다. 
        너는 요즘 회사 일이 바빠서 힘들지? 무리하지 말고 건강 챙기거라. 
        밥은 제때 챙겨 먹고, 잠도 충분히 자거라. 엄마가 걱정이야. 
        이번 주말에 시간 되면 집에 와서 같이 시간 보내자. 
        엄마가 좋아하는 음식 해줄게. 항상 건강하고 행복하거라, 우리 아들.`,
        estimatedSeconds: 45
    },
    {
        id: 'parent_2',
        title: '안부 인사',
        content: `우리 딸, 잘 지내고 있니? 엄마는 오늘도 건강하게 지내고 있어. 
        너는 요즘 어떻게 지내는지 궁금하구나. 회사 일은 잘 되고 있니? 
        무리하지 말고, 힘들면 쉬어도 돼. 건강이 제일이야. 
        요즘 날씨가 추워지는데 옷 따뜻하게 입고 다니거라. 
        감기 걸리지 말고, 물도 자주 마시고. 
        엄마는 네가 행복하면 나도 행복해. 항상 건강하고 행복하거라.`,
        estimatedSeconds: 43
    },
    {
        id: 'parent_3',
        title: '건강 챙기기',
        content: `우리 아들, 오늘도 건강하니? 엄마는 요즘 몸이 좀 안 좋아서 
        병원에 다니고 있어. 하지만 걱정하지 마, 괜찮아. 
        너는 건강 챙기거라. 밥 제때 먹고, 잠 충분히 자고, 
        운동도 가볍게라도 하거라. 엄마가 걱정이야. 
        요즘 너무 바빠 보이는데, 무리하지 말고 쉬어도 돼. 
        건강이 제일이란다. 항상 건강하고 행복하거라.`,
        estimatedSeconds: 40
    },
    {
        id: 'parent_4',
        title: '가족 이야기',
        content: `우리 딸, 오늘 저녁에 뭐 먹었니? 맛있게 먹었니? 
        엄마는 오늘 된장찌개를 끓여 먹었어. 네가 좋아하던 그 맛이야. 
        요즘 어떻게 지내는지 궁금하구나. 회사 일은 잘 되고 있니? 
        친구들은 잘 만나고 있니? 엄마는 네가 행복하면 나도 행복해. 
        이번 주말에 시간 되면 집에 와서 같이 시간 보내자. 
        엄마가 좋아하는 음식 해줄게. 항상 건강하고 행복하거라.`,
        estimatedSeconds: 44
    }
];

// 역할에 따라 대사집 반환
export const getScriptsByRole = (role: 'child' | 'parent'): VoiceScript[] => {
    return role === 'child' ? childScripts : parentScripts;
};

// 랜덤 대사 선택
export const getRandomScript = (role: 'child' | 'parent'): VoiceScript => {
    const scripts = getScriptsByRole(role);
    const randomIndex = Math.floor(Math.random() * scripts.length);
    return scripts[randomIndex];
};

