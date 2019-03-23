export default class RandomSampler {

    distribution: Array<[number, number]> = [];
    cdf: Array<[number, number]> = [];

    constructor(points: Array<[number, number]>) {
        // Pass points data
        this.setDistribution(points);
    }

    setDistribution(distribution: Array<[number, number]>) {
        this.distribution = [];
        distribution.forEach((point) => {
            this.distribution.push([point[0], point[1]]);
        });
    }

    calculateCdf() {
        const distribution = this.distribution;
        const cdf = this.cdf;
        cdf.push([0, 0]);
        for (let z = 1; z < distribution.length; z++) {
            cdf.push([
                    distribution[z][0],
                    (distribution[z][1] + distribution[z - 1][1]) * 0.5 * (distribution[z][0] - distribution[z - 1][0])
            ]);
        }
        for (let z = 1; z < cdf.length; z++) {
            cdf[z][1] += cdf[z - 1][1];
        }
    }

    scaleCdf(yMax: number) {
        const cdf = this.cdf;
        const factor = yMax / cdf[cdf.length - 1][1];
        cdf.forEach((point) => {
            point[1] *= factor;
        });
    }

    sample(uniformRandom: number) {
        if (uniformRandom < 0 || uniformRandom > 1) {
            return -1;
        }
        const cdf = this.cdf;
        const random = uniformRandom * cdf[cdf.length - 1][1];
        let i = 0;
        for (i = 0; i < cdf.length; i++) {
            if (cdf[i][1] > random) {
                break;
            }
        }
        const x = (((cdf[i][1] + cdf[i - 1][1]) / 2) / cdf[i][1] ) * cdf[i][0];

        return x / cdf[cdf.length - 1][0];
    }
}
